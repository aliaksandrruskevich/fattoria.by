<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$form_type = $data['form_type'] ?? ($data['form_name'] ?? 'universal');
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Валидация
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Логируем заявку
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\tIP:$ip\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// Telegram отправка - ВАЖНО: используем тот же токен что и в основном скрипте
$telegram_sent = false;
$token = "8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU";
$chat_id = "8138312997";

if (!empty($token) && !empty($chat_id)) {
    $text = "✅ Новая заявка с сайта fattoria.by (v3-исправленный)\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($email)) $text .= "📧 Email: $email\n";
    if (!empty($form_type)) $text .= "📝 Форма: $form_type\n";
    $text .= "🌐 IP: $ip\n";
    $text .= "⏰ Время: " . date('H:i:s d.m.Y');

    $url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text=" . urlencode($text);
    $result = @file_get_contents($url);
    $telegram_sent = ($result !== false);

    // Логируем результат Telegram
    $tg_log = date('d.m.Y H:i:s') . "\tv3-исправленный\t";
    $tg_log .= $telegram_sent ? 'SUCCESS' : 'FAILED';
    $tg_log .= "\t$phone\n";
    file_put_contents(__DIR__ . '/../telegram-send.log', $tg_log, FILE_APPEND);
}

// Email отправка (заглушка - всегда false для V3)
$email_sent = false;

// Возвращаем результат с полями для мониторинга
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
    'telegram_sent' => $telegram_sent,
    'email_sent' => $email_sent,
    'timestamp' => date('Y-m-d H:i:s'),
    'version' => 'v3-fixed'
], JSON_UNESCAPED_UNICODE);
?>
