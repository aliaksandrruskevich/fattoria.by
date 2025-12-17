<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';

// Логируем
file_put_contents(__DIR__ . '/../form-final.log', 
    date('d.m.Y H:i:s') . "\t$name\t$phone\n", FILE_APPEND);

// Telegram
$token = "8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU";
$chat_id = "8138312997";
$text = "Заявка: $name\nТелефон: $phone";
$url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text=" . urlencode($text);
@file_get_contents($url);

echo json_encode(['success' => true, 'message' => 'Отправлено!']);
?>
