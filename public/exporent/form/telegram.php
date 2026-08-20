<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

function telegramConfiguration(): ?array
{
    $token = getenv('TELEGRAM_BOT_TOKEN');
    $chatId = getenv('TELEGRAM_CHAT_ID');
    $token = is_string($token) ? trim($token) : '';
    $chatId = is_string($chatId) ? trim($chatId) : '';

    if (
        preg_match('/^\d+:[A-Za-z0-9_-]{20,}$/', $token) !== 1 ||
        preg_match('/^(?:-?\d+|@[A-Za-z0-9_]{5,})$/', $chatId) !== 1
    ) {
        error_log('[exporent-form] Telegram environment configuration is unavailable.');
        return null;
    }

    return ['token' => $token, 'chatId' => $chatId];
}

function sendTelegram(string $message): bool
{
    $configuration = telegramConfiguration();

    if ($configuration === null) {
        return false;
    }

    if (!function_exists('curl_init')) {
        error_log('[exporent-form] cURL extension is unavailable.');
        return false;
    }

    $curl = curl_init('https://api.telegram.org/bot' . $configuration['token'] . '/sendMessage');

    if ($curl === false) {
        error_log('[exporent-form] Telegram request initialization failed.');
        return false;
    }

    $curlOptions = [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $configuration['chatId'],
            'text' => $message,
            'parse_mode' => 'HTML',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ];

    if (PHP_OS_FAMILY === 'Windows' && defined('CURLSSLOPT_NATIVE_CA')) {
        $curlOptions[CURLOPT_SSL_OPTIONS] = CURLSSLOPT_NATIVE_CA;
    }

    curl_setopt_array($curl, $curlOptions);

    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_errno($curl);
    curl_close($curl);

    if ($curlError !== 0 || $status !== 200 || !is_string($body)) {
        error_log('[exporent-form] Telegram request failed.');
        return false;
    }

    $payload = json_decode($body, true);

    if (!is_array($payload) || ($payload['ok'] ?? false) !== true) {
        error_log('[exporent-form] Telegram rejected the request.');
        return false;
    }

    return true;
}
