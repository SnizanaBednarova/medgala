<?php
namespace MedGala;

class Config
{
    public string $appUrl;
    public string $gpMerchantNumber;
    public string $gpPrivateKey;
    public string $gpPrivateKeyPassword;
    public string $gpPublicKey;
    public string $gpUrl;
    public string $smtpHost;
    public int $smtpPort;
    public string $smtpUser;
    public string $smtpPass;
    public string $mailFrom;

    public function __construct()
    {
        $this->appUrl = getenv('APP_URL') ?: 'http://localhost:8011';
        $this->gpMerchantNumber = '20160190';
        $this->gpPrivateKey =  __DIR__ . '/../cert/gpwebpay-pvk-test.key';
        $this->gpPrivateKeyPassword = 'edvk48T5WFEgghr';
        $this->gpPublicKey =  __DIR__ . '/../cert/gpe.signing_test.pem';
        $this->gpUrl = 'https://test.3dsecure.gpwebpay.com/pgw/order.do';
        $this->smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->smtpPort = (int)(getenv('SMTP_PORT') ?: 587);
        $this->smtpUser = getenv('SMTP_USER') ?: 'ples.ostrava@ifmsa.cz';
        $this->smtpPass = getenv('SMTP_PASS') ?: '';
        $this->mailFrom = getenv('MAIL_FROM') ?: 'ples.ostrava@ifmsa.cz';
    }
}
