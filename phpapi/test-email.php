<?php
declare(strict_types=1);

use MedGala\Config;
use MedGala\Mailer;

require __DIR__ . '/vendor/autoload.php';

// Load env if exists
if (file_exists(__DIR__ . '/.env')) {
    Dotenv\Dotenv::createImmutable(__DIR__)->load();
}

$cfg = new Config();
$mailer = new Mailer($cfg);

$toEmail = $argv[1] ?? 'snizhana.liashevska@gmail.com';
$toName = $argv[2] ?? 'Test User';

echo "Testing email sending to: $toEmail ($toName)\n";

// Create a dummy PDF for testing attachment if it doesn't exist
$testPdf = __DIR__ . '/storage/test-attachment.pdf';
if (!is_dir(dirname($testPdf))) {
    mkdir(dirname($testPdf), 0777, true);
}
file_put_contents($testPdf, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF");

$ok = $mailer->sendTickets($toEmail, $toName, [$testPdf]);

if ($ok) {
    echo "Email sent successfully!\n";
} else {
    echo "Email sending failed. Check error logs.\n";
}
