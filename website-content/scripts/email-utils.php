<?php
declare(strict_types=1);

function shakeEmailGetConfigValue(string $name): string
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

        if ($value !== '') {
            return $value;
        }
    }

    throw new RuntimeException("Missing server configuration: {$name}.");
}

function shakeEmailSend(string $subject, string $message, ?string $replyTo = null): void
{
    $recipient = shakeEmailGetConfigValue('shake_contact_email');
    $sender = shakeEmailGetConfigValue('shake_sender_email');
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($sender, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Email recipient or sender configuration is invalid.');
    }

    $headers = [
        "From: SHAKE Website <{$sender}>",
        'Content-Type: text/plain; charset=UTF-8',
    ];
    if ($replyTo !== null) {
        $headers[] = "Reply-To: {$replyTo}";
    }

    set_error_handler(static function (int $severity, string $message): bool {
        throw new RuntimeException('The server could not hand the email to its mail service.');
    });
    try {
        $sent = mail($recipient, $subject, $message, implode("\r\n", $headers));
    } finally {
        restore_error_handler();
    }

    if (!$sent) {
        throw new RuntimeException('The server mail service did not accept the email.');
    }
}

function shakeEmailRespond(int $status, array $response): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response, JSON_THROW_ON_ERROR);
    exit;
}

function shakeEmailRequirePost(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        shakeEmailRespond(405, ['error' => 'Only POST requests are accepted.']);
    }
}
