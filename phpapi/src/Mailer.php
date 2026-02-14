<?php
namespace MedGala;

use Resend;

class Mailer
{
    private Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function sendTickets(string $toEmail, string $toName, array $attachments): bool
    {
        $resend = Resend::client($this->config->resendApiKey);

        try {
            $templatePath = __DIR__ . '/email.html';
            if (file_exists($templatePath)) {
                $body = file_get_contents($templatePath);
            } else {
                $body = "Dobrý den,<br><br>v příloze naleznete Vaše vstupenky na MedGala.<br><br>Těšíme se na Vás!";
            }

            $attachmentData = [];
            foreach ($attachments as $filePath) {
                if (file_exists($filePath)) {
                    $attachmentData[] = [
                        'filename' => basename($filePath),
                        'content' => base64_encode(file_get_contents($filePath)),
                    ];
                }
            }

            $resend->emails->send([
                'from' => 'MedGala <' . $this->config->mailFrom . '>',
                'to' => [$toEmail],
                'subject' => 'Vaše vstupenky na MedGala',
                'html' => $body,
                'attachments' => $attachmentData,
            ]);

            return true;
        } catch (\Exception $e) {
            error_log("Resend Mailer Error: " . $e->getMessage());
            return false;
        }
    }
}
