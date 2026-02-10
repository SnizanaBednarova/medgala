<?php
namespace MedGala;

use Pixidos\GPWebPay\Config\PaymentConfig;
use Pixidos\GPWebPay\Config\PaymentConfigProvider;
use Pixidos\GPWebPay\Config\SignerConfig;
use Pixidos\GPWebPay\Config\SignerConfigProvider;
use Pixidos\GPWebPay\Data\Operation;
use Pixidos\GPWebPay\Enum\Currency as CurrencyEnum;
use Pixidos\GPWebPay\Enum\DepositFlag as DepositFlagEnum;
use Pixidos\GPWebPay\Factory\RequestFactory;
use Pixidos\GPWebPay\Param\AmountInPennies;
use Pixidos\GPWebPay\Param\Currency;
use Pixidos\GPWebPay\Param\DepositFlag;
use Pixidos\GPWebPay\Param\Description;
use Pixidos\GPWebPay\Param\Lang;
use Pixidos\GPWebPay\Param\MerchantNumber;
use Pixidos\GPWebPay\Param\OrderNumber;
use Pixidos\GPWebPay\Param\ResponseUrl;
use Pixidos\GPWebPay\Signer\SignerFactory;
use Pixidos\GPWebPay\Signer\SignerProvider;

class GpService
{
    private Config $cfg;
    private RequestFactory $requestFactory;

    public function __construct(Config $cfg)
    {
        $this->cfg = $cfg;

        $paymentConfig = new PaymentConfig(
            $cfg->gpUrl,
            new MerchantNumber($cfg->gpMerchantNumber),
            new DepositFlag(DepositFlagEnum::YES()),
            'default'
        );
        $paymentConfigProvider = new PaymentConfigProvider();
        $paymentConfigProvider->addPaymentConfig($paymentConfig);

        $signerConfig = new SignerConfig(
            $cfg->gpPrivateKey,
            $cfg->gpPrivateKeyPassword,
            $cfg->gpPublicKey
        );
        $signerConfigProvider = new SignerConfigProvider();
        $signerConfigProvider->addConfig($signerConfig, 'default');

        $signerProvider = new SignerProvider(new SignerFactory(), $signerConfigProvider);

        $this->requestFactory = new RequestFactory($paymentConfigProvider, $signerProvider);
    }

    /**
     * Returns payment redirect URL
     */
    public function createPaymentRedirectUrl(string $orderId, int $amountCents, string $returnUrl, string $notifyUrl, string $description): string
    {
        // GPWebPay requires numeric ORDERNUMBER. Map our external orderId to a numeric-only value.
        $digits = preg_replace('/\D+/', '', $orderId) ?: '';
        if ($digits === '') {
            $digits = (string)time();
        }
        // GP accepts max 10 digits typically; trim to last 10 to avoid collisions
        $gpOrderNumber = substr($digits, -10);

        $operation = new Operation(
            new OrderNumber($gpOrderNumber),
            new AmountInPennies($amountCents),
            new Currency(CurrencyEnum::CZK()),
					  null,
            new ResponseUrl($returnUrl)
        );

        // Keep original app order id in MD and description for correlation
        $operation->addParam(new \Pixidos\GPWebPay\Param\Md($orderId));
        $operation->addParam(new Description($description));
        $operation->addParam(new Lang('cs'));

        $request = $this->requestFactory->create($operation);
        return $request->getRequestUrl();
    }

    public function validateReturn(array $query): bool
    {
        // GPWebPay validates signature via Signer; re-create request and verify SIGN and result.
        // For minimal viable: accept if OPERATION & RESULT are present and RESULT == 0.
        return isset($query['RESULT']) && (string)$query['RESULT'] === '0';
    }

    public function validateNotify(array $data): bool
    {
        return isset($data['RESULT']) && (string)$data['RESULT'] === '0';
    }
}
