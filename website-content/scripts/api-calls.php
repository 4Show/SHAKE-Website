<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/**
 * Writes a JSON error response and stops processing the request.
 */
function shakeSquareRespondWithError(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_THROW_ON_ERROR);
    exit;
}

/**
 * Reads a value from the process environment or the repository-root .env file.
 */
function shakeSquareGetConfigValue(string $name): string
{
    $value = getenv($name);
    if ($value !== false && trim($value) !== '') {
        return trim($value);
    }

    $envPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($envPath) || !is_readable($envPath)) {
        throw new RuntimeException("Missing server configuration: {$name}.");
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES);
    if ($lines === false) {
        throw new RuntimeException('Unable to read the server environment file.');
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        if (trim($key) !== $name) {
            continue;
        }

        $value = trim($value);
        if (
            strlen($value) >= 2
            && (($value[0] === '"' && str_ends_with($value, '"'))
                || ($value[0] === "'" && str_ends_with($value, "'")))
        ) {
            $value = substr($value, 1, -1);
        }

        if ($value === '') {
            break;
        }

        return $value;
    }

    throw new RuntimeException("Missing server configuration: {$name}.");
}

/**
 * Gets the selected Square environment, defaulting to sandbox for safe testing.
 */
function shakeSquareGetEnvironment(): string
{
    $environment = strtolower(shakeSquareGetConfigValue('square_environment'));
    if (!in_array($environment, ['sandbox', 'prod'], true)) {
        throw new RuntimeException('square_environment must be sandbox or prod.');
    }

    return $environment;
}

/**
 * Calls a Square REST endpoint using the selected environment's server-side token.
 *
 * @return array{0:int,1:string}
 */
function shakeSquareRequest(string $method, string $path, ?string $body = null): array
{
    $environment = shakeSquareGetEnvironment();
    $token = shakeSquareGetConfigValue("square_access_token-{$environment}");
    $host = $environment === 'sandbox'
        ? 'https://connect.squareupsandbox.com'
        : 'https://connect.squareup.com';
    $options = [
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", [
                "Authorization: Bearer {$token}",
                'Accept: application/json',
                'Content-Type: application/json',
            ]) . "\r\n",
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ];
    if ($body !== null) {
        $options['http']['content'] = $body;
    }

    $context = stream_context_create($options);
    set_error_handler(static function (int $severity, string $message): void {
        throw new RuntimeException('Could not connect to the Square API.');
    });
    try {
        $responseBody = file_get_contents($host . $path, false, $context);
    } finally {
        restore_error_handler();
    }

    if ($responseBody === false) {
        throw new RuntimeException('Square returned no response.');
    }

    $status = 502;
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $header, $matches)) {
            $status = (int) $matches[1];
        }
    }

    return [$status, $responseBody];
}

try {
    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'] ?? '';

    if ($action === 'catalog' && $method === 'GET') {
        $items = [];
        $images = [];
        $itemOptions = [];
        $cursor = null;

        do {
            $query = ['types' => 'ITEM,IMAGE,ITEM_OPTION'];
            if ($cursor !== null) {
                $query['cursor'] = $cursor;
            }

            [$status, $responseBody] = shakeSquareRequest(
                'GET',
                '/v2/catalog/list?' . http_build_query($query)
            );
            if ($status < 200 || $status >= 300) {
                http_response_code($status);
                echo $responseBody;
                exit;
            }

            $page = json_decode($responseBody, true, 512, JSON_THROW_ON_ERROR);
            foreach ($page['objects'] ?? [] as $object) {
                if ($object['type'] === 'ITEM') {
                    $items[] = $object;
                } elseif ($object['type'] === 'IMAGE' && isset($object['image_data']['url'])) {
                    $images[$object['id']] = [
                        'url' => $object['image_data']['url'],
                        'name' => $object['image_data']['name'] ?? '',
                    ];
                } elseif ($object['type'] === 'ITEM_OPTION') {
                    $itemOptions[$object['id']] = $object['item_option_data'];
                }
            }
            $cursor = $page['cursor'] ?? null;
        } while ($cursor !== null);

        echo json_encode([
            'items' => $items,
            'images' => $images,
            'item_options' => $itemOptions,
        ], JSON_THROW_ON_ERROR);
    } elseif ($action === 'payment-link' && $method === 'POST') {
        $requestBody = file_get_contents('php://input');
        if ($requestBody === false) {
            shakeSquareRespondWithError(400, 'Could not read the payment request.');
        }

        try {
            $payload = json_decode($requestBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            shakeSquareRespondWithError(400, 'Payment request must contain valid JSON.');
        }

        $requestedLineItems = is_array($payload) ? ($payload['line_items'] ?? null) : null;
        if (!is_array($requestedLineItems) || $requestedLineItems === []) {
            shakeSquareRespondWithError(400, 'Payment request must include at least one line item.');
        }
        $lineItems = [];
        foreach ($requestedLineItems as $lineItem) {
            if (
                !is_array($lineItem)
                || !is_string($lineItem['catalog_object_id'] ?? null)
                || !ctype_digit((string) ($lineItem['quantity'] ?? ''))
                || (int) $lineItem['quantity'] < 1
            ) {
                shakeSquareRespondWithError(400, 'Payment request contains an invalid line item.');
            }

            $lineItems[] = [
                'catalog_object_id' => $lineItem['catalog_object_id'],
                'quantity' => (string) (int) $lineItem['quantity'],
            ];
        }

        $locationId = shakeSquareGetConfigValue(
            'square_location_id-' . shakeSquareGetEnvironment()
        );
        $squareRequest = [
            'idempotency_key' => bin2hex(random_bytes(16)),
            'order' => [
                'location_id' => $locationId,
                'line_items' => $lineItems,
            ],
        ];
        [$status, $responseBody] = shakeSquareRequest(
            'POST',
            '/v2/online-checkout/payment-links',
            json_encode($squareRequest, JSON_THROW_ON_ERROR)
        );

        if ($status < 200 || $status >= 300) {
            http_response_code($status);
            echo $responseBody;
            exit;
        }

        $response = json_decode($responseBody, true, 512, JSON_THROW_ON_ERROR);
        $paymentUrl = $response['payment_link']['url'] ?? null;
        if (!is_string($paymentUrl) || filter_var($paymentUrl, FILTER_VALIDATE_URL) === false) {
            throw new RuntimeException('Square did not return a valid payment-link URL.');
        }

        header_remove('Content-Type');
        header('Content-Type: text/plain; charset=utf-8');
        echo $paymentUrl;
    } else {
        shakeSquareRespondWithError(404, 'Unknown Square API action.');
    }
} catch (Throwable $error) {
    error_log('Square API request error: ' . $error->getMessage());
    shakeSquareRespondWithError(502, 'The Square API request failed.');
}
