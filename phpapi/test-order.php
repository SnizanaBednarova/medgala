<?php
declare(strict_types=1);

use MedGala\Config;
use MedGala\Mailer;
use MedGala\OrderStore;
use MedGala\TicketGenerator;

require __DIR__ . '/vendor/autoload.php';

// Load env
if (file_exists(__DIR__ . '/.env')) {
    Dotenv\Dotenv::createImmutable(__DIR__)->load();
}

$cfg = new Config();
$store = new OrderStore(__DIR__ . '/storage');
$tickets = new TicketGenerator(__DIR__ . '/storage');
$mailer = new Mailer($cfg);

// Create a fake order
$customer = [
    'firstName' => 'Test',
    'lastName' => 'User',
    'email' => 'snizhana.liashevska@gmail.com',
    'phone' => '+420123456789',
];

$items = [
    ['label' => 'F16 (VIP GOLD)', 'count' => 2, 'price' => 1599, 'table' => 'F16'],
    ['label' => 'M1 (STANDARD)', 'count' => 1, 'price' => 699, 'table' => 'M1'],
    ['label' => 'ECONOMY', 'count' => 1, 'price' => 499],
];

$total = 4396;

// Create order
$orderId = $store->createOrder($customer, $items, $total);
echo "Created order: $orderId\n";

// Mark as paid
$store->markPaid($orderId);
echo "Marked as paid\n";

// Generate tickets
$order = $store->getOrder($orderId);
if ($order) {
    $tickets->generateTickets($orderId, $order);
    echo "Generated tickets\n";

    $files = $tickets->listTicketFiles($orderId);
    echo "Ticket files: " . implode(', ', $files) . "\n";

    echo "Sending tickets to: " . $customer['email'] . "\n";
    $attachments = array_map(fn($f) => $tickets->getTicketPath($orderId, $f), $files);
    $ok = $mailer->sendTickets($customer['email'], $customer['firstName'] . ' ' . $customer['lastName'], $attachments);
    echo $ok ? "Sent successfully\n" : "Sending failed\n";
}

echo "\nDownload URL:\n";
echo "http://localhost:3000/vstupenky/download?order=" . urlencode($orderId) . "\n";
