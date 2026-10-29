<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/**
 * Writes a JSON error response and stops processing the request.
 */
function shakeApiRespondWithError(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_THROW_ON_ERROR);
    exit;
}

/**
 * Reads a configured endpoint from the process environment or the repository .env file.
 */
function shakeApiGetConfiguredEndpoint(string $name): string
{
    $value = getenv($name);
    if ($value !== false && trim($value) !== '') {
        $endpoint = trim($value);
    } else {
        $envPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($envPath) || !is_readable($envPath)) {
            throw new RuntimeException("Missing server configuration for {$name}.");
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            throw new RuntimeException('Unable to read the server environment file.');
        }

        $endpoint = '';
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $configuredValue] = explode('=', $line, 2);
            if (trim($key) !== $name) {
                continue;
            }

            $endpoint = trim($configuredValue);
            if (
                strlen($endpoint) >= 2
                && (($endpoint[0] === '"' && str_ends_with($endpoint, '"'))
                    || ($endpoint[0] === "'" && str_ends_with($endpoint, "'")))
            ) {
                $endpoint = substr($endpoint, 1, -1);
            }
            break;
        }
    }

    $urlParts = parse_url($endpoint);
    if (
        filter_var($endpoint, FILTER_VALIDATE_URL) === false
        || ($urlParts['scheme'] ?? '') !== 'https'
    ) {
        throw new RuntimeException("Set {$name} to a valid HTTPS endpoint in the server environment.");
    }

    return $endpoint;
}

/**
 * Sends a request to one configured backend function and returns its response and status.
 */
function shakeApiForwardRequest(string $endpoint, string $method, ?string $body = null): array
{
    $options = [
        'http' => [
            'method' => $method,
            'header' => "Accept: application/json\r\nContent-Type: application/json\r\n",
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ];
    if ($body !== null) {
        $options['http']['content'] = $body;
    }

    $context = stream_context_create($options);
    set_error_handler(static function (int $severity, string $message): void {
        throw new RuntimeException('Could not reach the configured Square backend.');
    });
    try {
        $responseBody = file_get_contents($endpoint, false, $context);
    } finally {
        restore_error_handler();
    }

    if ($responseBody === false) {
        throw new RuntimeException('The configured Square backend returned no response.');
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
    if ($action === 'catalog' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $endpoint = shakeApiGetConfiguredEndpoint('SQUARE_CATALOG_FUNCTION_URL');
        [$status, $responseBody] = shakeApiForwardRequest($endpoint, 'GET');
    } elseif ($action === 'payment-link' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $requestBody = file_get_contents('php://input');
        if ($requestBody === false) {
            shakeApiRespondWithError(400, 'Could not read the payment request.');
        }

        try {
            $payload = json_decode($requestBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            shakeApiRespondWithError(400, 'Payment request must contain valid JSON.');
        }

        $lineItems = is_array($payload) ? ($payload['line_items'] ?? null) : null;
        if (!is_array($lineItems) || $lineItems === []) {
            shakeApiRespondWithError(400, 'Payment request must include at least one line item.');
        }
        foreach ($lineItems as $lineItem) {
            if (
                !is_array($lineItem)
                || !is_string($lineItem['catalog_object_id'] ?? null)
                || !ctype_digit((string) ($lineItem['quantity'] ?? ''))
                || (int) $lineItem['quantity'] < 1
                || ($lineItem['item_type'] ?? null) !== 'ITEM'
            ) {
                shakeApiRespondWithError(400, 'Payment request contains an invalid line item.');
            }
        }

        $endpoint = shakeApiGetConfiguredEndpoint('SQUARE_PAYMENT_LINK_FUNCTION_URL');
        [$status, $responseBody] = shakeApiForwardRequest(
            $endpoint,
            'POST',
            json_encode(['line_items' => $lineItems], JSON_THROW_ON_ERROR)
        );
        header_remove('Content-Type');
        header('Content-Type: text/plain; charset=utf-8');
    } else {
        shakeApiRespondWithError(404, 'Unknown Square API action.');
    }

    http_response_code($status);
    echo $responseBody;
} catch (Throwable $error) {
    error_log('Square API proxy error: ' . $error->getMessage());
    shakeApiRespondWithError(502, 'The Square service request failed.');
}
