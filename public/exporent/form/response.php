<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
