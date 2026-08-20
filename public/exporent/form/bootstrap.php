<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

require __DIR__ . '/response.php';
require __DIR__ . '/request.php';
require __DIR__ . '/rate-limit.php';
require __DIR__ . '/message.php';
require __DIR__ . '/telegram.php';
require __DIR__ . '/handler.php';
