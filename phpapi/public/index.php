<?php
declare(strict_types=1);

use MedGala\Config;
use MedGala\GpService;
use MedGala\Mailer;
use MedGala\OrderStore;
use MedGala\TicketGenerator;

require __DIR__ . '/../vendor/autoload.php';

// Load env
if (file_exists(__DIR__ . '/../.env')) {
    Dotenv\Dotenv::createImmutable(__DIR__ . '/..')->load();
}

// Basic JSON response helpers
function json($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$cfg = new Config();
$store = new OrderStore(__DIR__ . '/../storage');
$tickets = new TicketGenerator(__DIR__ . '/../storage');
$gp = new GpService($cfg);
$mailer = new Mailer($cfg);

// Routes
if ($path === '/api/payment/init' && $method === 'POST') {
    $body = getJsonBody();

    $customer = [
        'firstName' => trim((string)($body['firstName'] ?? '')),
        'lastName'  => trim((string)($body['lastName'] ?? '')),
        'email'     => trim((string)($body['email'] ?? '')),
        'phone'     => trim((string)($body['phone'] ?? '')),
    ];
    $agree = (bool)($body['agree'] ?? false);
    $items = $body['items'] ?? [];
    $total = (int)($body['total'] ?? 0);

    if (!$agree || !$customer['email'] || $total <= 0 || !is_array($items) || empty($items)) {
        return json(['error' => 'Invalid payload'], 400);
    }

    // Create a local order
    $orderId = $store->createOrder($customer, $items, $total);

    // Create payment and get redirect URL
    try {
        $redirectUrl = $gp->createPaymentRedirectUrl(
            orderId: $orderId,
            amountCents: $total * 100, // GP expects minor units if configured so; adjust per config
            returnUrl: rtrim($cfg->appUrl, '/') . '/api/payment/return?order=' . urlencode($orderId),
            notifyUrl: rtrim($cfg->appUrl, '/') . '/api/payment/notify?order=' . urlencode($orderId),
            description: 'MedGala vstupenky ' . $orderId
        );
    } catch (Throwable $e) {
        error_log('GP create error: ' . $e->getMessage());
        return json(['error' => 'Payment init failed'], 500);
    }

    return json(['orderId' => $orderId, 'redirectUrl' => $redirectUrl]);
}

if ($path === '/api/payment/return' && $method === 'GET') {
    $orderId = (string)($_GET['order'] ?? '');
    if (!$orderId) {
        http_response_code(400);
        echo 'Missing order';
        exit;
    }

    $ok = false;
    try {
        $ok = $gp->validateReturn($_GET);
    } catch (Throwable $e) {
        error_log('GP return validation error: ' . $e->getMessage());
    }

    if ($ok) {
        // mark paid and generate tickets (idempotent)
        $newlyPaid = $store->markPaid($orderId);
        $order = $store->getOrder($orderId);
        if ($order) {
            try {
                $tickets->generateTickets($orderId, $order);
                if ($newlyPaid) {
                    $customer = $order['customer'] ?? [];
                    $email = $customer['email'] ?? '';
                    $name = ($customer['firstName'] ?? '') . ' ' . ($customer['lastName'] ?? '');
                    if ($email) {
                        $files = $tickets->listTicketFiles($orderId);
                        $attachments = array_map(fn($f) => $tickets->getTicketPath($orderId, $f), $files);
                        $mailer->sendTickets($email, $name, $attachments);
                    }
                }
            } catch (Throwable $e) {
                error_log('Ticket generation or mailing error: ' . $e->getMessage());
            }
        }
        // redirect to download page on the static site
        header('Location: /vstupenky/download?order=' . urlencode($orderId));
    } else {
        header('Location: /vstupenky?status=failed');
    }
    exit;
}

if ($path === '/api/payment/notify' && in_array($method, ['GET','POST'], true)) {
    $orderId = (string)(($_GET['order'] ?? $_POST['order'] ?? ''));
    $ok = false;
    try {
        $ok = $gp->validateNotify($_REQUEST);
    } catch (Throwable $e) {
        error_log('GP notify validation error: ' . $e->getMessage());
    }
    if ($ok && $orderId) {
        $newlyPaid = $store->markPaid($orderId);
        $order = $store->getOrder($orderId);
        if ($order) {
            try {
                $tickets->generateTickets($orderId, $order);
                if ($newlyPaid) {
                    $customer = $order['customer'] ?? [];
                    $email = $customer['email'] ?? '';
                    $name = ($customer['firstName'] ?? '') . ' ' . ($customer['lastName'] ?? '');
                    if ($email) {
                        $files = $tickets->listTicketFiles($orderId);
                        $attachments = array_map(fn($f) => $tickets->getTicketPath($orderId, $f), $files);
                        $mailer->sendTickets($email, $name, $attachments);
                    }
                }
            } catch (Throwable $e) {
                error_log('Ticket generation or mailing error: ' . $e->getMessage());
            }
        }
        echo 'OK';
    } else {
        http_response_code(400);
        echo 'INVALID';
    }
    exit;
}

if ($path === '/api/tickets/list' && $method === 'GET') {
    $orderId = (string)($_GET['order'] ?? '');
    if (!$orderId) return json(['error' => 'Missing order'], 400);
    $order = $store->getOrder($orderId);
    if (!$order || ($order['status'] ?? '') !== 'paid') return json(['error' => 'Not found'], 404);
    $files = $tickets->listTicketFiles($orderId);
    return json(['orderId' => $orderId, 'files' => $files]);
}

if ($path === '/api/tickets/download' && $method === 'GET') {
    $orderId = (string)($_GET['order'] ?? '');
    $file = basename((string)($_GET['file'] ?? ''));
    if (!$orderId || !$file) {
        http_response_code(400);
        echo 'Missing params';
        exit;
    }
    $order = $store->getOrder($orderId);
    if (!$order || ($order['status'] ?? '') !== 'paid') {
        http_response_code(404);
        echo 'Not found';
        exit;
    }
    $pathFile = $tickets->getTicketPath($orderId, $file);
    if (!is_file($pathFile)) {
        http_response_code(404);
        echo 'Missing file';
        exit;
    }
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $file . '"');
    readfile($pathFile);
    exit;
}

if ($path === '/api/test/create-order' && $method === 'POST') {
    $customer = [
        'firstName' => 'Test',
        'lastName' => 'User',
        'email' => $cfg->smtpUser,
        'phone' => '+420123456789',
    ];
    $items = [
        ['label' => 'VIP Vstupenka', 'count' => 2, 'price' => 2500],
        ['label' => 'Standard Vstupenka', 'count' => 1, 'price' => 1500],
    ];
    $total = 6500;
    $orderId = $store->createOrder($customer, $items, $total);
    $newlyPaid = $store->markPaid($orderId);
    $order = $store->getOrder($orderId);
    if ($order) {
        try {
            $tickets->generateTickets($orderId, $order);
            if ($newlyPaid) {
                $customer = $order['customer'] ?? [];
                $email = $customer['email'] ?? '';
                $name = ($customer['firstName'] ?? '') . ' ' . ($customer['lastName'] ?? '');
                if ($email) {
                    $files = $tickets->listTicketFiles($orderId);
                    $attachments = array_map(fn($f) => $tickets->getTicketPath($orderId, $f), $files);
                    $mailer->sendTickets($email, $name, $attachments);
                }
            }
        } catch (Throwable $e) {
            error_log('Ticket generation or mailing error: ' . $e->getMessage());
        }
    }
    $files = $tickets->listTicketFiles($orderId);
    return json([
        'orderId' => $orderId,
        'files' => $files,
        'downloadUrl' => '/vstupenky/download?order=' . urlencode($orderId)
    ]);
}

if ($path === '/api/tables/occupied' && $method === 'GET') {
    return json($store->getOccupiedSeats());
}

// Fallback
http_response_code(404);
header('Content-Type: text/plain');
echo 'Not Found';
