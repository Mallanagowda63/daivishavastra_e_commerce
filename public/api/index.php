<?php
// Daivisha Vastra store API — stores products, orders, bookings, reviews, coupons and banners in MongoDB.
// Called by the website as /api/?a=<action>. Admin actions need the token returned by ?a=login.

declare(strict_types=1);

use MongoDB\BSON\Regex;
use MongoDB\Driver\BulkWrite;
use MongoDB\Driver\Command;
use MongoDB\Driver\Manager;
use MongoDB\Driver\Query;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const CONFIG_FILE = __DIR__ . '/config.php';
if (!is_file(CONFIG_FILE)) fail(500, 'Server is not configured yet.');
$CONFIG = require CONFIG_FILE;
require __DIR__ . '/notify.php';

const DB = 'daivishavastra';
const SESSION_HOURS = 12;
const GIFT_WRAP = 250;
const SHIPPING = 350;
const FREE_SHIPPING_FROM = 4999;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

// ───────────────────────── helpers ─────────────────────────

function fail(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

function ok($data = ['ok' => true]): void
{
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function db(): Manager
{
    static $m = null;
    global $CONFIG;
    if ($m === null) {
        try {
            $m = new Manager($CONFIG['mongo_uri'], [], ['typeMap' => ['root' => 'array', 'document' => 'array', 'array' => 'array']]);
        } catch (Throwable $e) {
            fail(503, 'Database unavailable.');
        }
    }
    return $m;
}

/** Find documents; strips Mongo's _id so the website gets plain objects. */
function find(string $coll, array $filter = [], array $opts = []): array
{
    try {
        $cursor = db()->executeQuery(DB . ".$coll", new Query($filter, $opts));
        $cursor->setTypeMap(['root' => 'array', 'document' => 'array', 'array' => 'array']);
        $out = [];
        foreach ($cursor as $doc) {
            unset($doc['_id']);
            $out[] = $doc;
        }
        return $out;
    } catch (Throwable $e) {
        fail(503, 'Database unavailable.');
    }
    return [];
}

function findOne(string $coll, array $filter): ?array
{
    return find($coll, $filter, ['limit' => 1])[0] ?? null;
}

function write(string $coll, callable $build): void
{
    $bw = new BulkWrite(['ordered' => true]);
    $build($bw);
    try {
        db()->executeBulkWrite(DB . ".$coll", $bw);
    } catch (Throwable $e) {
        fail(503, 'Could not save. Please try again.');
    }
}

function upsert(string $coll, array $filter, array $doc): void
{
    write($coll, fn(BulkWrite $b) => $b->update($filter, ['$set' => $doc], ['upsert' => true]));
}

function remove(string $coll, array $filter): void
{
    write($coll, fn(BulkWrite $b) => $b->delete($filter, ['limit' => 1]));
}

/** Atomic counter, used for order numbers. */
function nextNumber(string $name, int $start): int
{
    try {
        $res = db()->executeCommand(DB, new Command([
            'findAndModify' => 'counters',
            'query' => ['_id' => $name],
            'update' => ['$inc' => ['value' => 1]],
            'upsert' => true,
            'new' => true,
        ]))->toArray()[0];
        $value = (int) ($res->value->value ?? 1);
    } catch (Throwable $e) {
        fail(503, 'Database unavailable.');
    }
    return $start + $value;
}

function body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if (strlen($raw) > 2_000_000) fail(413, 'Request too large.');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function str($v, int $max): string
{
    $s = is_string($v) ? trim($v) : (is_numeric($v) ? (string) $v : '');
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

function now(): string
{
    return gmdate('c');
}

function clientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/** Simple per-IP limit for public forms. */
function rateLimit(string $bucket, int $max, int $seconds): void
{
    $key = $bucket . ':' . hash('sha256', clientIp());
    $since = time() - $seconds;
    $hits = find('ratelimits', ['key' => $key, 't' => ['$gt' => $since]]);
    if (count($hits) >= $max) fail(429, 'Too many requests. Please try again later.');
    write('ratelimits', function (BulkWrite $b) use ($key, $since) {
        $b->insert(['key' => $key, 't' => time()]);
        $b->delete(['t' => ['$lt' => $since - 86400]]);
    });
}

// ───────────────────────── admin auth ─────────────────────────

function bearer(): string
{
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($h === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) if (strtolower($k) === 'authorization') $h = $v;
    }
    return preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $h, $m) ? strtolower($m[1]) : '';
}

function isAdmin(): bool
{
    static $cached = null;
    if ($cached !== null) return $cached;
    $t = bearer();
    if ($t === '') return $cached = false;
    $s = findOne('sessions', ['hash' => hash('sha256', $t), 'exp' => ['$gt' => time()]]);
    return $cached = $s !== null;
}

function requireAdmin(): void
{
    if (!isAdmin()) fail(401, 'Please sign in to the admin again.');
}

function adminPasswordHash(): string
{
    global $CONFIG;
    $s = findOne('settings', ['key' => 'admin_password_hash']);
    return $s['value'] ?? $CONFIG['admin_password_hash'];
}

// ───────────────────────── orders ─────────────────────────

function usableCoupon(string $code): ?array
{
    if ($code === '') return null;
    $c = findOne('coupons', ['code' => strtoupper($code)]);
    if (!$c || ($c['active'] ?? true) === false) return null;
    if (!empty($c['expiresAt']) && strtotime($c['expiresAt']) < time()) return null;
    return $c;
}

/** Builds an order from the cart, using prices and stock from the database (never the browser's numbers). */
function buildOrder(array $in, bool $fromAdmin): array
{
    $items = [];
    $subtotal = 0;
    $wrap = 0;
    foreach (array_slice((array) ($in['items'] ?? []), 0, 30) as $it) {
        $pid = str($it['id'] ?? '', 120);
        $qty = max(1, min(20, (int) ($it['quantity'] ?? 1)));
        $p = findOne('products', ['id' => $pid]);
        if (!$p || (!$fromAdmin && ($p['status'] ?? 'published') !== 'published')) fail(400, 'A saree in your bag is no longer available.');
        if (!$fromAdmin && (int) ($p['stock'] ?? 0) < $qty) fail(409, "Sorry, only {$p['stock']} left of {$p['name']}.");
        $price = (int) round((float) ($p['sellingPrice'] ?? 0));
        $items[] = [
            'id' => $p['id'],
            'name' => $p['name'],
            'image' => $p['images'][0] ?? '',
            'price' => $price,
            'quantity' => $qty,
            'color' => str($it['color'] ?? ($p['color'] ?? ''), 60),
        ];
        $subtotal += $price * $qty;
        if (!empty($it['includeGiftWrap'])) $wrap += GIFT_WRAP;
    }
    if (!$items) fail(400, 'Your bag is empty.');

    $discount = 0;
    $coupon = usableCoupon(str($in['couponCode'] ?? '', 30));
    if ($coupon && $subtotal >= (int) ($coupon['minimumOrder'] ?? 0)) {
        $discount = !empty($coupon['discountPercentage'])
            ? (int) round($subtotal * (float) $coupon['discountPercentage'] / 100)
            : min($subtotal, (int) ($coupon['discountAmount'] ?? 0));
    }
    // Website orders follow the shipping rule; orders the admin records keep the shipping they enter.
    $shipping = $fromAdmin ? max(0, (int) ($in['shipping'] ?? 0)) : ($subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING);

    $a = (array) ($in['shippingAddress'] ?? []);
    $address = [
        'fullName' => str($a['fullName'] ?? '', 80),
        'phone' => str($a['phone'] ?? '', 20),
        'addressLine' => str($a['addressLine'] ?? '', 200),
        'city' => str($a['city'] ?? '', 60),
        'state' => str($a['state'] ?? '', 60),
        'pincode' => str($a['pincode'] ?? '', 10),
    ];
    if (!$fromAdmin) {
        if (mb_strlen($address['fullName']) < 2 || mb_strlen($address['addressLine']) < 6 || $address['city'] === '' || !preg_match('/^\d{6}$/', $address['pincode'])) {
            fail(400, 'Please check the delivery address.');
        }
        if (!preg_match('/^(\+?91)?[6-9]\d{9}$/', preg_replace('/[\s-]/', '', $address['phone']))) fail(400, 'Please check the phone number.');
        if (!filter_var(str($in['customerEmail'] ?? '', 120), FILTER_VALIDATE_EMAIL)) fail(400, 'Please check the email address.');
    }

    return [
        'id' => 'ord-' . bin2hex(random_bytes(6)),
        'orderNumber' => 'DV-' . nextNumber('order', 1000),
        'date' => $fromAdmin && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in['date'] ?? '')) ? $in['date'] : gmdate('Y-m-d', time() + 19800),
        'createdAt' => now(),
        'customerEmail' => strtolower(str($in['customerEmail'] ?? '', 120)),
        'items' => $items,
        'subtotal' => $subtotal,
        'discount' => $discount,
        'giftWrap' => $wrap,
        'shipping' => $shipping,
        'total' => max(0, $subtotal - $discount + $wrap + $shipping),
        'couponCode' => $coupon['code'] ?? null,
        'status' => $fromAdmin ? str($in['status'] ?? 'Confirmed', 20) : 'Pending',
        'paymentStatus' => $fromAdmin ? str($in['paymentStatus'] ?? 'Pending', 20) : 'Pending',
        'paymentMethod' => str($in['paymentMethod'] ?? 'UPI', 80),
        'paymentReference' => str($in['paymentReference'] ?? '', 40),
        'paymentDate' => $fromAdmin && ($in['paymentStatus'] ?? '') === 'Paid' ? now() : null,
        'shippingAddress' => $address,
        'trackingNumber' => '—',
        'carrier' => 'To be assigned',
        'estimatedDelivery' => str($in['estimatedDelivery'] ?? '', 40),
    ];
}

function reduceStock(array $items): void
{
    write('products', function (BulkWrite $b) use ($items) {
        foreach ($items as $it) $b->update(['id' => $it['id']], ['$inc' => ['stock' => -$it['quantity']]]);
    });
    write('products', fn(BulkWrite $b) => $b->update(['stock' => ['$lt' => 0]], ['$set' => ['stock' => 0]], ['multi' => true]));
}

// ───────────────────────── routes ─────────────────────────

$action = $_GET['a'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') ok();
$post = $method === 'POST';

switch ($action) {
    case 'health':
        find('products', [], ['limit' => 1]);
        ok(['ok' => true, 'time' => now()]);

    // ── public ──
    case 'catalog': {
        $products = find('products', isAdmin() ? [] : ['$or' => [['status' => 'published'], ['status' => ['$exists' => false]]]], ['sort' => ['createdAt' => -1]]);
        $banners = [];
        foreach (find('banners') as $b) $banners[$b['key']] = $b['image'];
        $coupons = array_values(array_filter(find('coupons', [], ['sort' => ['createdAt' => -1]]), fn($c) => isAdmin() || ((($c['active'] ?? true) !== false) && (empty($c['expiresAt']) || strtotime($c['expiresAt']) >= time()))));
        $reviews = find('reviews', isAdmin() ? [] : ['status' => 'approved'], ['sort' => ['date' => -1], 'limit' => isAdmin() ? 500 : 100]);
        ok(compact('products', 'banners', 'coupons', 'reviews'));
    }

    case 'review.add': {
        if (!$post) fail(405, 'Use POST.');
        rateLimit('review', 5, 3600);
        $in = body();
        $r = [
            'id' => 'rev-' . bin2hex(random_bytes(6)),
            'name' => str($in['name'] ?? '', 60),
            'city' => str($in['city'] ?? '', 40),
            'rating' => max(1, min(5, (int) ($in['rating'] ?? 5))),
            'comment' => str($in['comment'] ?? '', 800),
            'productId' => str($in['productId'] ?? '', 120) ?: null,
            'productName' => str($in['productName'] ?? '', 120) ?: null,
            'date' => now(),
            'status' => 'pending',
        ];
        if (mb_strlen($r['name']) < 2 || mb_strlen($r['comment']) < 10) fail(400, 'Please add your name and a few words about the saree.');
        write('reviews', fn(BulkWrite $b) => $b->insert($r));
        ok(['ok' => true]);
    }

    case 'order.place': {
        if (!$post) fail(405, 'Use POST.');
        rateLimit('order', 10, 3600);
        $order = buildOrder(body(), false);
        write('orders', fn(BulkWrite $b) => $b->insert($order));
        reduceStock($order['items']);
        // Reply first, then email the customer and alert the owner (email + WhatsApp).
        respondNow($order);
        emailOrderPlaced($order);
        emailOwnerNewOrder($order);
        whatsappOwnerNewOrder($order);
        exit;
    }

    case 'login': {
        if (!$post) fail(405, 'Use POST.');
        rateLimit('login', 8, 900);
        $in = body();
        global $CONFIG;
        $emailOk = hash_equals(strtolower($CONFIG['admin_email']), strtolower(str($in['email'] ?? '', 120)));
        $passOk = password_verify((string) ($in['password'] ?? ''), adminPasswordHash());
        if (!$emailOk || !$passOk) fail(401, 'Wrong email or password.');
        $token = bin2hex(random_bytes(32));
        write('sessions', function (BulkWrite $b) use ($token) {
            $b->insert(['hash' => hash('sha256', $token), 'exp' => time() + SESSION_HOURS * 3600]);
            $b->delete(['exp' => ['$lt' => time()]]);
        });
        ok(['token' => $token, 'expiresInHours' => SESSION_HOURS]);
    }

    // ── admin ──
    case 'logout':
        requireAdmin();
        remove('sessions', ['hash' => hash('sha256', bearer())]);
        ok();

    case 'password.change': {
        requireAdmin();
        $in = body();
        if (!password_verify((string) ($in['current'] ?? ''), adminPasswordHash())) fail(400, 'Current password is wrong.');
        $new = (string) ($in['next'] ?? '');
        if (strlen($new) < 10) fail(400, 'Use at least 10 characters for the new password.');
        upsert('settings', ['key' => 'admin_password_hash'], ['key' => 'admin_password_hash', 'value' => password_hash($new, PASSWORD_DEFAULT)]);
        write('sessions', fn(BulkWrite $b) => $b->delete(['hash' => ['$ne' => hash('sha256', bearer())]]));
        ok();
    }

    case 'admin.data':
        requireAdmin();
        ok([
            'orders' => find('orders', [], ['sort' => ['createdAt' => -1], 'limit' => 2000]),
            'bookings' => find('bookings', [], ['sort' => ['date' => -1], 'limit' => 2000]),
        ]);

    case 'product.save': {
        requireAdmin();
        $p = body();
        $id = str($p['id'] ?? '', 120);
        if ($id === '' || str($p['name'] ?? '', 200) === '') fail(400, 'Product needs a name.');
        unset($p['_id']);
        $p['updatedAt'] = now();
        if (!findOne('products', ['id' => $id])) $p['createdAt'] = now();
        upsert('products', ['id' => $id], $p);
        ok(findOne('products', ['id' => $id]));
    }

    case 'product.delete':
        requireAdmin();
        remove('products', ['id' => str(body()['id'] ?? '', 120)]);
        ok();

    case 'order.add':
        requireAdmin();
        $order = buildOrder(body(), true);
        write('orders', fn(BulkWrite $b) => $b->insert($order));
        reduceStock($order['items']);
        ok($order);

    case 'order.update': {
        requireAdmin();
        $in = body();
        $patch = array_intersect_key((array) ($in['patch'] ?? []), array_flip(['status', 'paymentStatus', 'paymentDate', 'trackingNumber', 'carrier', 'estimatedDelivery', 'notes']));
        foreach ($patch as $k => $v) $patch[$k] = str($v, 200);
        $oid = str($in['id'] ?? '', 60);
        $before = findOne('orders', ['id' => $oid]);
        if (!$before) fail(404, 'Order not found.');
        if ($patch) upsert('orders', ['id' => $oid], $patch);
        respondNow(['ok' => true]);
        // Email the customer only when the status really changes (out for delivery, delivered, cancelled).
        if (isset($patch['status']) && ($before['status'] ?? null) !== $patch['status']) emailOrderUpdate(array_merge($before, $patch), ['status' => $patch['status']]);
        exit;
    }

    case 'booking.save': {
        requireAdmin();
        $in = body();
        $b = [
            'id' => str($in['id'] ?? '', 60) ?: 'bk-' . bin2hex(random_bytes(6)),
            'customerName' => str($in['customerName'] ?? '', 80),
            'phone' => str($in['phone'] ?? '', 20),
            'service' => str($in['service'] ?? '', 60),
            'date' => str($in['date'] ?? '', 10),
            'time' => str($in['time'] ?? '', 5),
            'status' => str($in['status'] ?? 'Pending', 20),
            'notes' => str($in['notes'] ?? '', 500),
        ];
        upsert('bookings', ['id' => $b['id']], $b);
        ok($b);
    }

    case 'review.status': {
        requireAdmin();
        $in = body();
        $status = in_array($in['status'] ?? '', ['pending', 'approved', 'hidden'], true) ? $in['status'] : fail(400, 'Unknown status.');
        upsert('reviews', ['id' => str($in['id'] ?? '', 60)], ['status' => $status]);
        ok();
    }

    case 'review.delete':
        requireAdmin();
        remove('reviews', ['id' => str(body()['id'] ?? '', 60)]);
        ok();

    case 'banner.set': {
        requireAdmin();
        $in = body();
        $key = str($in['key'] ?? '', 80);
        $image = str($in['image'] ?? '', 500);
        if ($key === '' || !preg_match('#^(https?://|/)\S+$#', $image)) fail(400, 'Use an image link or upload a photo.');
        upsert('banners', ['key' => $key], ['key' => $key, 'image' => $image]);
        ok();
    }

    case 'banner.remove':
        requireAdmin();
        remove('banners', ['key' => str(body()['key'] ?? '', 80)]);
        ok();

    case 'coupons.save': {
        requireAdmin();
        // Replaces the whole coupon list (the admin page edits it as one list).
        $list = array_slice((array) (body()['coupons'] ?? []), 0, 200);
        write('coupons', function (BulkWrite $b) use ($list) {
            $b->delete([]);
            foreach ($list as $c) {
                $code = strtoupper(str($c['code'] ?? '', 20));
                if ($code === '') continue;
                $b->insert([
                    'code' => $code,
                    'discountPercentage' => isset($c['discountPercentage']) ? (float) $c['discountPercentage'] : null,
                    'discountAmount' => isset($c['discountAmount']) ? (float) $c['discountAmount'] : null,
                    'minimumOrder' => (float) ($c['minimumOrder'] ?? 0),
                    'description' => str($c['description'] ?? '', 200),
                    'expiresAt' => str($c['expiresAt'] ?? '', 25) ?: null,
                    'active' => ($c['active'] ?? true) !== false,
                    'featured' => !empty($c['featured']),
                    'createdAt' => str($c['createdAt'] ?? '', 30) ?: now(),
                ]);
            }
        });
        ok();
    }

    case 'upload': {
        requireAdmin();
        // Saves an image in /uploads and returns its link; the database only stores the link.
        $f = $_FILES['file'] ?? null;
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) fail(400, 'Upload failed.');
        if ($f['size'] > MAX_UPLOAD_BYTES) fail(413, 'Image is too large (max 6 MB).');
        $info = @getimagesize($f['tmp_name']);
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$info['mime'] ?? ''] ?? null;
        if (!$ext) fail(400, 'Please upload a JPG, PNG or WEBP photo.');
        $dir = dirname(__DIR__) . '/uploads/' . gmdate('Y/m');
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) fail(500, 'Could not save the image.');
        $name = bin2hex(random_bytes(8)) . ".$ext";
        if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) fail(500, 'Could not save the image.');
        ok(['url' => '/uploads/' . gmdate('Y/m') . "/$name"]);
    }

    default:
        fail(404, 'Unknown action.');
}
