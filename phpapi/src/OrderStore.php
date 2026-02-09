<?php
namespace MedGala;

class OrderStore
{
    private string $base;

    public function __construct(string $storageBase)
    {
        $this->base = rtrim($storageBase, '/');
        if (!is_dir($this->base)) @mkdir($this->base, 0777, true);
        if (!is_dir($this->base . '/orders')) @mkdir($this->base . '/orders', 0777, true);
        if (!is_dir($this->base . '/tickets')) @mkdir($this->base . '/tickets', 0777, true);
    }

    public function createOrder(array $customer, array $items, int $total): string
    {
        $orderId = date('YmdHis') . '-' . bin2hex(random_bytes(3));
        $data = [
            'id' => $orderId,
            'createdAt' => date('c'),
            'status' => 'pending',
            'customer' => $customer,
            'items' => $items,
            'total' => $total,
        ];
        file_put_contents($this->base . '/orders/' . $orderId . '.json', json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
        return $orderId;
    }

    public function markPaid(string $orderId): bool
    {
        $o = $this->getOrder($orderId);
        if (!$o) return false;
        if (($o['status'] ?? '') === 'paid') return false; // already paid
        $o['status'] = 'paid';
        $this->saveOrder($o);
        return true;
    }

    public function getOrder(string $orderId): ?array
    {
        $f = $this->base . '/orders/' . basename($orderId) . '.json';
        if (!is_file($f)) return null;
        $json = json_decode((string)file_get_contents($f), true);
        return is_array($json) ? $json : null;
    }

    public function getOccupiedSeats(): array
    {
        $occupied = [];
        $files = glob($this->base . '/orders/*.json');
        if (!$files) return [];

        foreach ($files as $file) {
            $json = json_decode((string)file_get_contents($file), true);
            if (!is_array($json) || ($json['status'] ?? '') !== 'paid') {
                continue;
            }

            $items = $json['items'] ?? [];
            foreach ($items as $item) {
                $table = $item['table'] ?? null;
                $count = (int)($item['count'] ?? 0);
                if ($table && $count > 0) {
                    $occupied[$table] = ($occupied[$table] ?? 0) + $count;
                }
            }
        }
        return $occupied;
    }

    private function saveOrder(array $order): void
    {
        $id = $order['id'] ?? '';
        if (!$id) return;
        file_put_contents($this->base . '/orders/' . $id . '.json', json_encode($order, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    }
}
