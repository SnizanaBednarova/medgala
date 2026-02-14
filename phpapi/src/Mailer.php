<?php
namespace MedGala;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    private Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function sendTickets(string $toEmail, string $toName, array $attachments): bool
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = gethostbyname($this->config->smtpHost);
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->config->smtpUser;
            $mail->Password   = $this->config->smtpPass;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = $this->config->smtpPort;
            $mail->CharSet    = 'UTF-8';
					$mail->SMTPDebug = 2;
					$mail->Debugoutput = 'error_log';
					$mail->Timeout = 20;

            // Recipients
            $mail->setFrom($this->config->mailFrom, 'MedGala');
            $mail->addAddress($toEmail, $toName);

            // Attachments
            foreach ($attachments as $filePath) {
                if (file_exists($filePath)) {
                    $mail->addAttachment($filePath);
                }
            }

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Vaše vstupenky na MedGala';
            $templatePath = __DIR__ . '/email.html';
            if (file_exists($templatePath)) {
                $mail->Body = file_get_contents($templatePath);
            } else {
                $mail->Body = "Dobrý den,<br><br>v příloze naleznete Vaše vstupenky na MedGala.<br><br>Těšíme se na Vás!";
            }

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Mailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}
