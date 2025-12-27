<?php
// ВСЕГДА ПЕРВЫМИ ИДУТ HEADERS!
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$form_type = $data['form_type'] ?? ($data['form_name'] ?? 'universal');
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? 'direct_cli');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'cli_test';

// Валидация
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// АБСОЛЮТНЫЕ ПУТИ к лог файлам
$form_log = '/home/fattoriaby/public_html/form-final.log';
$telegram_log = '/home/fattoriaby/public_html/telegram-send.log';

// Логируем заявку
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\tIP:$ip\n";
file_put_contents($form_log, $log_entry, FILE_APPEND);

// Telegram отправка - ИСПОЛЬЗУЕМ ТОТ ЖЕ ТОКЕН ЧТО И В V2
$telegram_sent = false;
$telegram_error = '';

$token = "8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU";
$chat_id = "8138312997";

if (!empty($token) && !empty($chat_id)) {
    $text = "✅ Новая заявка с сайта fattoria.by (v3-working)\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($email)) $text .= "📧 Email: $email\n";
    if (!empty($form_type)) $text .= "📝 Форма: $form_type\n";
    $text .= "🌐 Страница: $page_url\n";
    $text .= "🌐 IP: $ip\n";
    $text .= "⏰ Время: " . date('H:i:s d.m.Y');

    // Используем file_get_contents как в V2 (самый простой способ)
    $url = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text=" . urlencode($text);
    $result = @file_get_contents($url);
    
    $telegram_sent = ($result !== false);
    
    // Логируем результат Telegram
    $tg_log_entry = date('d.m.Y H:i:s') . "\tv3-working\t";
    $tg_log_entry .= $telegram_sent ? 'SUCCESS' : 'FAILED';
    $tg_log_entry .= "\t$phone\n";
    file_put_contents($telegram_log, $tg_log_entry, FILE_APPEND);
}

// Возвращаем результат
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка отправлена.',
    'timestamp' => date('Y-m-d H:i:s'),
    'notifications' => [
        'telegram' => $telegram_sent,
        'email' => false
    ],
    'version' => 'v3-working',
    'debug' => [
        'log_written' => true,
        'telegram_log_written' => file_exists($telegram_log)
    ]
]);
?>
