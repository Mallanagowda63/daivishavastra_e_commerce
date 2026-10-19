<?php
// Order emails (Resend) and owner WhatsApp alerts (CallMeBot). Included by index.php.
// Every send is logged in the "notifications" collection; a failed send never breaks an order.

declare(strict_types=1);

use MongoDB\Driver\BulkWrite;

function cfg(string $key, $default = '')
{
    global $CONFIG;
    return $CONFIG[$key] ?? $default;
}

function logNotification(string $kind, string $to, bool $ok, string $info = ''): void
{
    $doc = ['kind' => $kind, 'to' => $to, 'ok' => $ok, 'info' => mb_substr($info, 0, 300), 'at' => gmdate('c')];
    try {
        $bw = new BulkWrite();
        $bw->insert($doc);
        db()->executeBulkWrite(DB . '.notifications', $bw);
    } catch (Throwable $e) {
        // logging is best-effort
    }
}

function httpRequest(string $method, string $url, array $headers = [], ?string $body = null): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $res = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return [$code, $res === false ? $err : (string) $res];
}

function sendEmail(string $to, string $subject, string $html, string $text, string $kind): void
{
    $key = cfg('resend_api_key');
    if ($key === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        logNotification($kind, $to, false, $key === '' ? 'no Resend key' : 'invalid email');
        return;
    }
    [$code, $res] = httpRequest('POST', 'https://api.resend.com/emails', [
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
    ], json_encode([
        'from' => cfg('mail_from', 'Daivisha Vastra <info@daivishavastra.com>'),
        'to' => [$to],
        'reply_to' => cfg('owner_email', 'info@daivishavastra.com'),
        'subject' => $subject,
        'html' => $html,
        'text' => $text,
    ]));
    logNotification($kind, $to, $code >= 200 && $code < 300, "$code $res");
}

/** WhatsApp message to the store owner through CallMeBot (free; needs a one-time activation key). */
function whatsappOwner(string $text, string $kind): void
{
    $phone = preg_replace('/\D/', '', (string) cfg('owner_whatsapp'));
    $key = (string) cfg('callmebot_apikey');
    if ($phone === '' || $key === '') {
        logNotification($kind, $phone, false, 'WhatsApp alerts not activated yet (no CallMeBot key)');
        return;
    }
    $url = 'https://api.callmebot.com/whatsapp.php?' . http_build_query(['phone' => $phone, 'text' => $text, 'apikey' => $key]);
    [$code, $res] = httpRequest('GET', $url);
    $ok = $code === 200 && stripos($res, 'error') === false;
    logNotification($kind, $phone, $ok, $code . ' ' . strip_tags($res));
}

/** Sends the JSON reply to the browser now and keeps running, so emails don't slow the checkout. */
function respondNow(array $data): void
{
    ignore_user_abort(true);
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    header('Content-Length: ' . strlen($json));
    header('Connection: close');
    echo $json;
    if (function_exists('litespeed_finish_request')) litespeed_finish_request();
    elseif (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
    else { @ob_flush(); flush(); }
}

// ───────────────────────── email building ─────────────────────────

function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function inr($n): string
{
    $n = (int) round((float) $n);
    $s = (string) abs($n);
    // Indian digit grouping: 1,23,456
    if (strlen($s) > 3) {
        $last3 = substr($s, -3);
        $rest = substr($s, 0, -3);
        $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
        $s = "$rest,$last3";
    }
    return '₹' . $s;
}

function absUrl(string $path): string
{
    if (preg_match('#^https?://#', $path)) return $path;
    return rtrim((string) cfg('site_url', 'https://daivishavastra.com'), '/') . '/' . ltrim($path, '/');
}

function firstName(array $order): string
{
    $n = trim((string) ($order['shippingAddress']['fullName'] ?? ''));
    return $n === '' ? 'there' : explode(' ', $n)[0];
}

/** Shared email frame in the store's colours; table layout so it renders in every mail app. */
function emailFrame(string $preheader, string $heading, string $body): string
{
    $site = e((string) cfg('site_url', 'https://daivishavastra.com'));
    $wa = preg_replace('/\D/', '', (string) cfg('owner_whatsapp', '918147036004'));
    $waDisplay = '+91 ' . substr($wa, -10, 5) . ' ' . substr($wa, -5);
    $mail = e((string) cfg('owner_email', 'info@daivishavastra.com'));
    return <<<HTML
<!doctype html><html><body style="margin:0;padding:0;background:#f6efe6;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">{$preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe6;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf9;border:1px solid #e6d6bf;">
<tr><td style="background:#4c1012;padding:22px 28px;text-align:center;">
  <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:3px;color:#f3dfae;">DAIVISHA VASTRA</div>
  <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:#e5cb6e;margin-top:4px;">Elegant attire rooted in Indian heritage</div>
</td></tr>
<tr><td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#3d3530;font-size:15px;line-height:1.6;">
  <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:normal;color:#6b1418;font-size:24px;margin:0 0 14px;">{$heading}</h1>
  {$body}
</td></tr>
<tr><td style="padding:8px 28px 26px;font-family:Arial,Helvetica,sans-serif;color:#6f5f5c;font-size:13px;line-height:1.6;">
  <hr style="border:0;border-top:1px solid #e6d6bf;margin:18px 0;">
  Questions about your order? We are happy to help.<br>
  WhatsApp / call: <strong style="color:#3d3530;">{$waDisplay}</strong> &nbsp;·&nbsp; Email: <a href="mailto:{$mail}" style="color:#6b1418;">{$mail}</a><br>
  <a href="{$site}" style="color:#6b1418;">{$site}</a>
</td></tr>
</table>
<div style="font-family:Arial,sans-serif;font-size:11px;color:#9a8b84;margin-top:12px;">Every saree has a story. Thank you for making us part of yours.</div>
</td></tr></table></body></html>
HTML;
}

function itemsTable(array $order): string
{
    $rows = '';
    foreach ($order['items'] as $it) {
        $img = e(absUrl((string) ($it['image'] ?? '')));
        $name = e((string) $it['name']);
        $meta = e(trim(($it['color'] ?? '') !== '' ? "Colour: {$it['color']} · Qty {$it['quantity']}" : "Qty {$it['quantity']}"));
        $price = inr($it['price'] * $it['quantity']);
        $rows .= "<tr><td style=\"padding:10px 0;border-bottom:1px solid #efe4d6;width:64px;\"><img src=\"{$img}\" width=\"56\" alt=\"\" style=\"display:block;width:56px;height:auto;border:1px solid #e6d6bf;\"></td>"
            . "<td style=\"padding:10px 12px;border-bottom:1px solid #efe4d6;font-size:14px;\"><strong style=\"color:#3d3530;\">{$name}</strong><br><span style=\"color:#8a7b74;font-size:12px;\">{$meta}</span></td>"
            . "<td style=\"padding:10px 0;border-bottom:1px solid #efe4d6;text-align:right;white-space:nowrap;font-size:14px;\">{$price}</td></tr>";
    }
    $line = fn($label, $value, $bold = false) => "<tr><td colspan=\"2\" style=\"padding:4px 0;font-size:14px;" . ($bold ? 'font-weight:bold;color:#3d3530;' : 'color:#6f5f5c;') . "\">{$label}</td><td style=\"padding:4px 0;text-align:right;font-size:14px;" . ($bold ? 'font-weight:bold;color:#6b1418;' : '') . "\">{$value}</td></tr>";
    $sum = $line('Subtotal', inr($order['subtotal']));
    if (!empty($order['discount'])) $sum .= $line('Discount' . (!empty($order['couponCode']) ? ' (' . e($order['couponCode']) . ')' : ''), '− ' . inr($order['discount']));
    if (!empty($order['giftWrap'])) $sum .= $line('Gift wrap', inr($order['giftWrap']));
    $sum .= $line('Shipping', $order['shipping'] ? inr($order['shipping']) : 'Free');
    $sum .= $line('Total', inr($order['total']), true);
    return "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:8px 0 6px;\">{$rows}{$sum}</table>";
}

function addressBlock(array $order): string
{
    $a = $order['shippingAddress'];
    $lines = array_filter([$a['fullName'] ?? '', $a['addressLine'] ?? '', trim(($a['city'] ?? '') . ', ' . ($a['state'] ?? '') . ' ' . ($a['pincode'] ?? ''), ', '), $a['phone'] ?? '']);
    return '<p style="margin:0;color:#3d3530;">' . implode('<br>', array_map('e', $lines)) . '</p>';
}

function emailOrderPlaced(array $order): void
{
    $num = e($order['orderNumber']);
    $name = e(firstName($order));
    $body = "<p style=\"margin:0 0 12px;\">Namaste {$name},</p>"
        . "<p style=\"margin:0 0 12px;\">Thank you for choosing Daivisha Vastra. We have received your order <strong>{$num}</strong> and we are delighted that one of our sarees will soon be part of your story.</p>"
        . "<p style=\"margin:0 0 16px;\">Our team will verify your payment and confirm the order with you shortly. We will email you again when your saree is out for delivery.</p>"
        . itemsTable($order)
        . "<p style=\"margin:18px 0 6px;font-weight:bold;color:#6b1418;\">Delivering to</p>" . addressBlock($order)
        . "<p style=\"margin:18px 0 6px;font-weight:bold;color:#6b1418;\">What happens next</p>"
        . "<ol style=\"margin:0 0 0 18px;padding:0;color:#3d3530;\"><li>We verify your payment (usually within a few hours).</li><li>Your saree is carefully checked, folded and packed.</li><li>We email you on the day your saree is out for delivery.</li></ol>"
        . "<p style=\"margin:16px 0 0;font-size:13px;color:#6f5f5c;\">Please note: payments are non-refundable. Eligible items can be exchanged or replaced as per our Returns &amp; Exchange Policy.</p>"
        . "<p style=\"margin:16px 0 0;\">With warm regards,<br><strong>Team Daivisha Vastra</strong></p>";
    $text = "Namaste " . firstName($order) . ",\n\nThank you for choosing Daivisha Vastra. We have received your order {$order['orderNumber']} (total " . inr($order['total']) . ").\nOur team will verify your payment and confirm your order shortly. We will email you again when your saree is out for delivery.\n\nWith warm regards,\nTeam Daivisha Vastra";
    sendEmail((string) $order['customerEmail'], "Thank you for your order {$order['orderNumber']} — Daivisha Vastra", emailFrame("We've received your order {$num}.", 'Thank you for your order', $body), $text, 'email:order-placed');
}

function emailOwnerNewOrder(array $order): void
{
    $a = $order['shippingAddress'];
    $body = "<p style=\"margin:0 0 12px;\">A new order has been placed on the website.</p>"
        . "<p style=\"margin:0 0 12px;\"><strong>Order:</strong> " . e($order['orderNumber']) . "<br><strong>Payment:</strong> " . e($order['paymentMethod']) . " · " . e($order['paymentStatus'])
        . (!empty($order['paymentReference']) ? "<br><strong>Payment reference:</strong> " . e($order['paymentReference']) : '')
        . "<br><strong>Customer email:</strong> " . e((string) $order['customerEmail']) . "</p>"
        . itemsTable($order)
        . "<p style=\"margin:18px 0 6px;font-weight:bold;color:#6b1418;\">Ship to</p>" . addressBlock($order)
        . "<p style=\"margin:16px 0 0;\">Open the admin to confirm payment and update the order.</p>";
    $text = "New order {$order['orderNumber']} — " . inr($order['total']) . "\nCustomer: {$a['fullName']}, {$a['phone']}\nEmail: {$order['customerEmail']}";
    sendEmail((string) cfg('owner_email', 'info@daivishavastra.com'), "New order {$order['orderNumber']} · " . inr($order['total']) . " · {$a['fullName']}", emailFrame('New website order', 'New order received', $body), $text, 'email:owner-new-order');
}

function whatsappOwnerNewOrder(array $order): void
{
    $a = $order['shippingAddress'];
    $items = implode("\n", array_map(fn($it) => "• {$it['name']}" . (!empty($it['color']) ? " ({$it['color']})" : '') . " × {$it['quantity']}", $order['items']));
    $text = "🛍️ New order {$order['orderNumber']}\n{$items}\nTotal: " . inr($order['total']) . "\nPayment: {$order['paymentMethod']} ({$order['paymentStatus']})\n\n👤 {$a['fullName']}\n📞 {$a['phone']}\n📍 {$a['city']}, {$a['state']} {$a['pincode']}\n✉️ {$order['customerEmail']}";
    whatsappOwner($text, 'whatsapp:owner-new-order');
}

/**
 * Email to the customer when the admin changes the order status. Customers get exactly four emails:
 * order placed (sent at checkout), out for delivery, delivered and cancelled. Other statuses send nothing.
 */
function emailOrderUpdate(array $order, array $patch): void
{
    $num = e($order['orderNumber']);
    $name = e(firstName($order));
    $status = $patch['status'] ?? null;
    $tracking = trim((string) ($order['trackingNumber'] ?? ''));
    $carrier = trim((string) ($order['carrier'] ?? ''));
    $hasTracking = $tracking !== '' && $tracking !== '—';
    $hasCarrier = $carrier !== '' && $carrier !== 'To be assigned';

    if ($status === 'Out for Delivery') {
        $subject = "Your saree is out for delivery today — order {$order['orderNumber']}";
        $heading = 'Out for delivery today';
        $msg = "<p style=\"margin:0 0 12px;\">Your order <strong>{$num}</strong> is out for delivery and should reach you today. Please keep your phone close so the delivery partner can reach you.</p>"
            . ($hasTracking || $hasCarrier ? "<p style=\"margin:0 0 12px;\">" . ($hasCarrier ? "<strong>Courier:</strong> " . e($carrier) . "<br>" : '') . ($hasTracking ? "<strong>Tracking number:</strong> " . e($tracking) : '') . "</p>" : '')
            . "<p style=\"margin:0 0 12px;\">When it arrives, please check the parcel. If anything is not right, message us with your order number and photos and we will help you.</p>";
    } elseif ($status === 'Delivered') {
        $subject = "Delivered — thank you for shopping with Daivisha Vastra";
        $heading = 'Your order has been delivered';
        $msg = "<p style=\"margin:0 0 12px;\">Your order <strong>{$num}</strong> has been delivered. We hope your new saree brings you joy and beautiful memories.</p>"
            . "<p style=\"margin:0 0 12px;\">We would love to hear what you think. You can leave a review on the saree's page on our website, and if you share a photo on Instagram, tag us <strong>@daivishavastra</strong>.</p>";
    } elseif ($status === 'Cancelled') {
        $subject = "Update on your order {$order['orderNumber']}";
        $heading = 'Your order has been cancelled';
        $msg = "<p style=\"margin:0 0 12px;\">Your order <strong>{$num}</strong> has been cancelled. If you did not expect this, or would like help choosing another saree, please reply to this email or message us on WhatsApp and we will gladly assist you.</p>";
    } else {
        return; // Confirmed, Packed, Shipped, payment changes: no email
    }
    $body = "<p style=\"margin:0 0 12px;\">Namaste {$name},</p>{$msg}" . itemsTable($order)
        . "<p style=\"margin:16px 0 0;\">With warm regards,<br><strong>Team Daivisha Vastra</strong></p>";
    $text = "Namaste " . firstName($order) . ",\n\n" . trim(html_entity_decode(strip_tags(str_replace(['</p>', '<br>'], ["\n\n", "\n"], $msg)))) . "\n\nWith warm regards,\nTeam Daivisha Vastra";
    sendEmail((string) ($order['customerEmail'] ?? ''), $subject, emailFrame(strip_tags($heading), $heading, $body), $text, 'email:order-' . strtolower(str_replace(' ', '-', $status)));
}
