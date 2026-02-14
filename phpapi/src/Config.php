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
    public string $resendApiKey;

    public function __construct()
    {
        $this->appUrl = getenv('APP_URL') ?: 'http://localhost:8011';
        $this->gpMerchantNumber = '20160190';
				$this->gpPublicKey  = __DIR__ . '/../cert/gpe.signing_prod.pem';       // GP TEST public cert (na ověřování odpovědí)
			  $this->gpPrivateKey = __DIR__ . '/../cert/gpwebpay-pvk.key';
				$this->gpPrivateKeyPassword = 'L0DSqTSFQG:HFX';
        $this->gpUrl = 'https://3dsecure.gpwebpay.com/pgw/order.do';
        $this->smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->smtpPort = (int)(getenv('SMTP_PORT') ?: 465);
        $this->smtpUser = getenv('SMTP_USER') ?: 'ples.ostrava@ifmsa.cz';
        $this->smtpPass = getenv('SMTP_PASS') ?: 'vdpt zylc axgc ylkf';
        $this->mailFrom = getenv('MAIL_FROM') ?: 'vstupenky@medgala.cz';
        $this->resendApiKey = 're_AfupV9Pd_EEGgGuGHCjy7mxqVcbeXRg5P';
    }
}
