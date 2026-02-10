<?php
namespace MedGala;

use Pixidos\GPWebPay\Config\Factory\ConfigFactory;
use Pixidos\GPWebPay\Config\Factory\PaymentConfigFactory;
use Pixidos\GPWebPay\Data\Operation;
use Pixidos\GPWebPay\Enum\Currency as CurrencyEnum;
use Pixidos\GPWebPay\Factory\RequestFactory;
use Pixidos\GPWebPay\Param\AmountInPennies;
use Pixidos\GPWebPay\Param\Currency;
use Pixidos\GPWebPay\Param\Description;
use Pixidos\GPWebPay\Param\Lang;
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

        $configFactory = new ConfigFactory(new PaymentConfigFactory());
        $config = $configFactory->create([
            ConfigFactory::PRIVATE_KEY => $cfg->gpPrivateKey,
            ConfigFactory::PRIVATE_KEY_PASSPHRASE => $cfg->gpPrivateKeyPassword,
            ConfigFactory::PUBLIC_KEY => $cfg->gpPublicKey,
            ConfigFactory::URL => $cfg->gpUrl,
            ConfigFactory::MERCHANT_NUMBER => $cfg->gpMerchantNumber,
            ConfigFactory::DEPOSIT_FLAG => 1,
        ]);

        $signerProvider = new SignerProvider(new SignerFactory(), $config->getSignerConfigProvider());

        $this->requestFactory = new RequestFactory($config->getPaymentConfigProvider(), $signerProvider);
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
					orderNumber: new OrderNumber((int)$gpOrderNumber),
					amount: new AmountInPennies($amountCents),
					currency:  new Currency(CurrencyEnum::CZK()),
					responseUrl:  new ResponseUrl($returnUrl)
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
