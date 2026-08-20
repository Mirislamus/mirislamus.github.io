<?php

declare(strict_types=1);

namespace Exporent\Form;

use DateTimeImmutable;
use JsonException;

if (!defined('EXPORENT_FORM_ENTRY')) {
    http_response_code(404);
    exit;
}

const MAX_ITEMS = 50;

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function normalizedText(mixed $value, int $maxLength): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $text = trim(strip_tags($value));
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';

    return textLength($text) <= $maxLength ? $text : null;
}

function normalizePhone(mixed $value): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $digits = preg_replace('/\D+/', '', $value) ?? '';

    return preg_match('/^998\d{9}$/', $digits) === 1 ? '+' . $digits : null;
}

function isValidDateOnly(string $value): bool
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);

    return $date !== false && $date->format('Y-m-d') === $value;
}

function validateItems(mixed $rawItems, string $requestType, array &$fieldErrors): array
{
    if (!is_string($rawItems) || strlen($rawItems) > 32768) {
        $fieldErrors['items'] = 'required';
        return [];
    }

    try {
        $items = json_decode($rawItems, true, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        $fieldErrors['items'] = 'required';
        return [];
    }

    if (!is_array($items) || count($items) < 1 || count($items) > MAX_ITEMS) {
        $fieldErrors['items'] = 'required';
        return [];
    }

    if ($requestType === 'quick' && count($items) !== 1) {
        $fieldErrors['items'] = 'required';
        return [];
    }

    $validated = [];

    foreach ($items as $item) {
        if (!is_array($item)) {
            $fieldErrors['items'] = 'required';
            return [];
        }

        $kind = $item['kind'] ?? null;
        $itemId = normalizedText($item['itemId'] ?? null, 120);
        $sku = normalizedText($item['sku'] ?? '', 80);
        $title = normalizedText($item['title'] ?? null, 160);
        $variant = normalizedText($item['variant'] ?? '', 160);
        $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);

        if (
            ($kind !== 'product' && $kind !== 'stand') ||
            $itemId === null || $itemId === '' ||
            preg_match('/^[A-Za-z0-9][A-Za-z0-9._\/-]{0,119}$/', $itemId) !== 1 ||
            $sku === null ||
            ($sku !== '' && preg_match('/^[A-Z0-9][A-Z0-9-]{0,79}$/', $sku) !== 1) ||
            ($kind === 'stand' && $sku === '') ||
            $title === null || $title === '' ||
            $variant === null ||
            $quantity === false || $quantity < 1 || $quantity > 99 ||
            ($requestType === 'quick' && $quantity !== 1)
        ) {
            $fieldErrors['items'] = 'required';
            return [];
        }

        $validated[] = [
            'kind' => $kind,
            'itemId' => $itemId,
            'sku' => $sku,
            'title' => $title,
            'variant' => $variant,
            'quantity' => $quantity,
        ];
    }

    return $validated;
}

function validateRequest(array $input, string $requestType): array
{
    $fieldErrors = [];
    $name = normalizedText($input['name'] ?? null, 80);
    $phone = normalizePhone($input['phone'] ?? null);
    $locale = $input['locale'] ?? null;
    $consent = $input['consent'] ?? null;

    if ($name === null || textLength($name) < 2) {
        $fieldErrors['name'] = $name === '' ? 'required' : 'nameTooShort';
    }

    if ($phone === null) {
        $fieldErrors['phone'] = 'phoneInvalid';
    }

    if ($consent !== '1') {
        $fieldErrors['consent'] = 'consentRequired';
    }

    if (!is_string($locale) || !in_array($locale, ['ru', 'en', 'uz'], true)) {
        $fieldErrors['locale'] = 'required';
    }

    $items = validateItems($input['items'] ?? null, $requestType, $fieldErrors);
    $comment = '';
    $rentalStart = null;
    $rentalEnd = null;

    if ($requestType === 'cart') {
        $comment = normalizedText($input['comment'] ?? '', 1200);

        if ($comment === null) {
            $fieldErrors['comment'] = 'required';
        }

        $startValue = $input['rentalStart'] ?? '';
        $endValue = $input['rentalEnd'] ?? '';

        if ($startValue !== '' || $endValue !== '') {
            if (
                !is_string($startValue) || !is_string($endValue) ||
                !isValidDateOnly($startValue) || !isValidDateOnly($endValue) ||
                $startValue < date('Y-m-d') || $endValue < $startValue
            ) {
                $fieldErrors['rentalRange'] = 'required';
            } else {
                $rentalStart = $startValue;
                $rentalEnd = $endValue;
            }
        }
    } elseif (
        (isset($input['comment']) && trim((string) $input['comment']) !== '') ||
        isset($input['rentalStart']) || isset($input['rentalEnd'])
    ) {
        respond(422, ['success' => false, 'error' => 'invalidRequest']);
    }

    if ($fieldErrors !== []) {
        respond(422, ['success' => false, 'error' => 'validationFailed', 'fieldErrors' => $fieldErrors]);
    }

    return [
        'requestType' => $requestType,
        'locale' => $locale,
        'name' => $name,
        'phone' => $phone,
        'items' => $items,
        'comment' => $comment,
        'rentalStart' => $rentalStart,
        'rentalEnd' => $rentalEnd,
    ];
}
