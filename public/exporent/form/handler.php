<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

const MAX_REQUEST_BYTES = 65536;

function handleRequest(): never
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['success' => false, 'error' => 'methodNotAllowed']);
    }

    $contentLength = filter_var($_SERVER['CONTENT_LENGTH'] ?? 0, FILTER_VALIDATE_INT);

    if ($contentLength === false || $contentLength < 0 || $contentLength > MAX_REQUEST_BYTES) {
        respond(413, ['success' => false, 'error' => 'requestTooLarge']);
    }

    $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));

    if (
        strpos($contentType, 'multipart/form-data') !== 0 &&
        strpos($contentType, 'application/x-www-form-urlencoded') !== 0
    ) {
        respond(415, ['success' => false, 'error' => 'unsupportedMediaType']);
    }

    $requestType = $_POST['requestType'] ?? null;

    if ($requestType !== 'cart' && $requestType !== 'quick') {
        respond(422, ['success' => false, 'error' => 'invalidRequest']);
    }

    if (normalizedText($_POST['website'] ?? '', 200) !== '') {
        respond(200, ['success' => true]);
    }

    $rateLimit = consumeRateLimit((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));

    if ($rateLimit === null) {
        error_log('[exporent-form] Rate limit storage is unavailable.');
        respond(503, ['success' => false, 'error' => 'submitError']);
    }

    if ($rateLimit === false) {
        respond(429, ['success' => false, 'error' => 'rateLimited']);
    }

    $request = validateRequest($_POST, $requestType);

    if (!sendTelegram(telegramMessage($request))) {
        respond(502, ['success' => false, 'error' => 'submitError']);
    }

    respond(200, ['success' => true]);
}
