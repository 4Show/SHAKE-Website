<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'email-utils.php';
shakeEmailRequirePost();

$emailInput = $_POST['email'] ?? null;
$phoneInput = $_POST['phone'] ?? '';
if (!is_string($emailInput) || !is_string($phoneInput)) {
    shakeEmailRespond(400, ['error' => 'Enter a valid email address and phone number.']);
}

$email = trim($emailInput);
$phone = trim($phoneInput);

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254
    || strlen($phone) > 40 || ($phone !== '' && !preg_match('/^[+()\d .-]+$/', $phone))) {
    shakeEmailRespond(400, ['error' => 'Enter a valid email address and phone number.']);
}

$body = "Newsletter signup request from the SHAKE website\n\n"
    . "Email: {$email}\n"
    . ($phone === '' ? '' : "Phone: {$phone}\n")
    . "\nThis request was submitted through the website newsletter form.";

try {
    shakeEmailSend('SHAKE newsletter signup request', $body, $email);
} catch (RuntimeException $error) {
    error_log($error->getMessage());
    shakeEmailRespond(500, ['error' => 'We could not submit your signup right now. Please try again later.']);
}

shakeEmailRespond(200, ['message' => 'Thanks for your interest. Your signup request has been sent.']);
