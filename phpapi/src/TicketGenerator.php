<?php
namespace MedGala;

use Dompdf\Dompdf;
use Dompdf\Options;
use chillerlan\QRCode\QRCode;

class TicketGenerator
{
    private string $base;

    public function __construct(string $storageBase)
    {
        $this->base = rtrim($storageBase, '/');
    }

    public function generateTickets(string $orderId, array $order): void
    {
        $dir = $this->base . '/tickets/' . basename($orderId);
        if (!is_dir($dir)) @mkdir($dir, 0777, true);

        $existing = glob($dir . '/*.pdf') ?: [];
        foreach ($existing as $f) @unlink($f);

        $customer = $order['customer'] ?? [];
        $items = $order['items'] ?? [];

        $idx = 1;
        foreach ($items as $item) {
            $label = (string)($item['label'] ?? 'Vstupenka');
            $count = (int)($item['count'] ?? 0);
            $price = (int)($item['price'] ?? 0);
            for ($i = 0; $i < $count; $i++) {
                $code = strtoupper(substr(sha1($orderId . '-' . $label . '-' . $idx), 0, 10));
                $html = $this->renderHtmlTicket($orderId, $customer, $label, $price, $idx, $code, $item);
                $file = sprintf('%s/ticket-%02d.pdf', $dir, $idx);
                $this->renderPdf($html, $file);
                $idx++;
            }
        }
    }

    private function renderHtmlTicket(string $orderId, array $customer, string $label, int $price, int $num, string $code, array $item): string
    {
        $qrCode = (new QRCode())->render($code);

        $bgName = 'standart.png';
        $isEconomy = false;
        $ll = strtolower($label);
        if (strpos($ll, 'economy') !== false) {
            $bgName = 'economy.png';
            $isEconomy = true;
        } elseif (strpos($ll, 'gold') !== false) {
            $bgName = 'gold.png';
        } elseif (strpos($ll, 'silver') !== false) {
            $bgName = 'silver.png';
        }

        $bgPath = __DIR__ . '/../public/img/tickets/' . $bgName;
        if (!file_exists($bgPath)) {
            $bgPath = __DIR__ . '/../../public/img/tickets/' . $bgName;
        }

        $table = (string)($item['table'] ?? '');
        if (!$table && preg_match('/^([A-Z0-9]+)\s*\(/i', $label, $m)) {
            $table = $m[1];
        }

        $cardStyle = $bgPath && file_exists($bgPath) ? "background-image: url('$bgPath'); background-size: contain; background-repeat: no-repeat;" : "border:1px solid #ddd; background-color: #003366; color: white;";

        return <<<HTML
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@page { margin: 0; }
body { margin: 0; padding: 0; font-family: DejaVu Sans, Arial, sans-serif; color: white; }
.card { position: relative; width: 100%; height: 100%; $cardStyle }
.qr { position: absolute; bottom: 475px; right: 220px; width: 260px; height: 260px; background: white; padding: 5px; border-radius: 8px; }
.table-box { position: absolute; bottom: 450px; left: 320px; width: 288px; height: 188px; text-align: center; line-height: 46px; font-size: 46px; font-weight: bold; color: #003366; }
.seat-box { position: absolute; bottom: 450px; left: 810px; width: 288px; height: 188px; text-align: center; line-height: 46px; font-size: 46px; font-weight: bold; color: #003366; }
</style></head><body>
  <div class="card">
HTML . ($isEconomy ? 
    '' :
    '<div class="table-box">' . $table . '</div><div class="seat-box">' . $num . '</div>'
) . <<<HTML
    <img src="$qrCode" class="qr">
  </div>
</body></html>
HTML;
    }

    private function renderPdf(string $html, string $file): void
    {
        // Increase time limit for PDF generation as it can be resource-intensive
        set_time_limit(300);

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('dpi', 300);
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A6', 'landscape');
        $dompdf->render();
        file_put_contents($file, $dompdf->output());
    }

    public function listTicketFiles(string $orderId): array
    {
        $dir = $this->base . '/tickets/' . basename($orderId);
        if (!is_dir($dir)) return [];
        $out = [];
        foreach (glob($dir . '/*.pdf') ?: [] as $f) {
            $out[] = basename($f);
        }
        sort($out);
        return $out;
    }

    public function getTicketPath(string $orderId, string $file): string
    {
        return $this->base . '/tickets/' . basename($orderId) . '/' . basename($file);
    }
}
