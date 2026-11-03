<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'email-utils.php';
shakeEmailRequirePost();

$nameInput = $_POST['name'] ?? null;
$emailInput = $_POST['email'] ?? null;
$messageInput = $_POST['message'] ?? null;
if (!is_string($nameInput) || !is_string($emailInput) || !is_string($messageInput)) {
    shakeEmailRespond(400, ['error' => 'Enter a valid name, email address, and message.']);
}

$name = trim($nameInput);
$email = trim($emailInput);
$message = trim($messageInput);

if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($email) > 254 || $message === '' || strlen($message) > 10000) {
    shakeEmailRespond(400, ['error' => 'Enter a valid name, email address, and message.']);
}

$body = "New message from the SHAKE contact form\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n\n"
    . "Message:\n{$message}\n";

try {
    shakeEmailSend('SHAKE website contact message', $body, $email);
} catch (RuntimeException $error) {
    error_log($error->getMessage());
    shakeEmailRespond(500, ['error' => 'We could not send your message right now. Please try again later.']);
}

shakeEmailRespond(200, ['message' => 'Thanks for contacting SHAKE. Your message has been sent.']);
