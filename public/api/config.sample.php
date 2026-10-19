<?php
// Copy to config.php and fill in. config.php is private and is not stored on GitHub.
return [
    'mongo_uri' => 'mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority',
    'admin_email' => 'admin@example.com',
    // php -r "echo password_hash('your-password', PASSWORD_DEFAULT);"
    'admin_password_hash' => '',
];
