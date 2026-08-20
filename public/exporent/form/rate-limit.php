<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 600;

function consumeRateLimit(string $ip): ?bool
{
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'exporent-rate-limit';

    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        return null;
    }

    $path = $directory . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
    $handle = fopen($path, 'c+');

    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }

        return null;
    }

    $contents = stream_get_contents($handle);
    $stored = is_string($contents) && $contents !== '' ? json_decode($contents, true) : [];
    $now = time();
    $attempts = [];

    if (is_array($stored)) {
        foreach ($stored as $timestamp) {
            if (is_int($timestamp) && $timestamp > $now - RATE_LIMIT_WINDOW) {
                $attempts[] = $timestamp;
            }
        }
    }

    $allowed = count($attempts) < RATE_LIMIT_MAX;

    if ($allowed) {
        $attempts[] = $now;
    }

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($attempts));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $allowed;
}
