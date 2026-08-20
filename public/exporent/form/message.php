<?php

declare(strict_types=1);

namespace Exporent\Form;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

function escapeTelegramHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function formatTelegramDate(string $value): string
{
    $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value);

    return $date === false ? escapeTelegramHtml($value) : $date->format('d.m.Y');
}

function telegramMessage(array $request): string
{
    $isCartRequest = $request['requestType'] === 'cart';
    $lines = [
        $isCartRequest
            ? '📩 <b>Новая заявка из корзины</b>'
            : '⚡ <b>Заявка «Арендовать в 1 клик»</b>',
        '🌐 Язык: <b>' . escapeTelegramHtml(strtoupper($request['locale'])) . '</b>',
        '',
        '👤 <b>Контакт</b>',
        'Имя: ' . escapeTelegramHtml($request['name']),
        'Телефон: <code>' . escapeTelegramHtml($request['phone']) . '</code>',
        '',
        '📦 <b>Позиции</b>',
    ];

    foreach ($request['items'] as $index => $item) {
        if ($index > 0) {
            $lines[] = '';
        }

        $kindLabel = $item['kind'] === 'stand' ? 'Стенд' : 'Товар';
        $lines[] = sprintf('%d. <b>%s</b>', $index + 1, escapeTelegramHtml($item['title']));
        $lines[] = 'Тип: ' . $kindLabel;

        if ($item['sku'] !== '') {
            $lines[] = 'Артикул: <code>' . escapeTelegramHtml($item['sku']) . '</code>';
        }

        if ($item['variant'] !== '') {
            $lines[] = 'Вариант: ' . escapeTelegramHtml($item['variant']);
        }

        $lines[] = 'Количество: <b>' . $item['quantity'] . '</b>';
        $lines[] = sprintf(
            'ID: <code>%s:%s</code>',
            escapeTelegramHtml($item['kind']),
            escapeTelegramHtml($item['itemId'])
        );
    }

    if ($isCartRequest) {
        $lines[] = '';
        $lines[] = '📅 <b>Период аренды</b>';
        $lines[] = $request['rentalStart'] !== null
            ? formatTelegramDate($request['rentalStart']) . ' — ' . formatTelegramDate($request['rentalEnd'])
            : 'Не указан';

        if ($request['comment'] !== '') {
            $lines[] = '';
            $lines[] = '💬 <b>Комментарий</b>';
            $lines[] = escapeTelegramHtml($request['comment']);
        }
    }

    return implode("\n", $lines);
}
