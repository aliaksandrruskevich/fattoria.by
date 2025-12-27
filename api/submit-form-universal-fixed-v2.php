<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$form_type = $data['form_type'] ?? ($data['form_name'] ?? 'universal');

// Валидация
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Логируем
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// Telegram отправка
$telegram_sent = false;
$token = "8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU";
$chat_id = "8138312997";
$text = "Заявка: $name\nТелефон: $phone";
if (!empty($email)) $text .= "\nEmail: $email";
if (!empty($form_type) && $form_type != 'universal') $text .= "\nФорма: $form_type";

$url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text=" . urlencode($text);
$result = @file_get_contents($url);
$telegram_sent = ($result !== false);

// Логируем результат Telegram
$tg_log = date('d.m.Y H:i:s') . "\tv2-fixed\t" . ($telegram_sent ? 'SUCCESS' : 'FAILED') . "\t$phone\n";
file_put_contents(__DIR__ . '/../telegram-send.log', $tg_log, FILE_APPEND);

// Email отправка (заглушка - всегда false пока не реализовано)
$email_sent = false;

// Ответ для мониторинга
echo json_encode([
    'success' => true,
    'message' => 'Отправлено!',
    'telegram_sent' => $telegram_sent,
    'email_sent' => $email_sent,
    'version' => 'v2-fixed'
]);
?>
