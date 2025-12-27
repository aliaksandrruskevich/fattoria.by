<?php
/**
 * УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ФОРМ ДЛЯ FATTORIA.BY
 * Основной скрипт для всех форм
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Конфигурация
define('TELEGRAM_TOKEN', '8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU');
define('TELEGRAM_CHAT_ID', '8138312997');
define('ADMIN_EMAIL', 'anfattoriya@gmail.com');
define('FORM_LOG', '/home/fattoriaby/public_html/form-final.log');
define('TELEGRAM_LOG', '/home/fattoriaby/public_html/telegram-send.log');

// Получаем данные из всех возможных источников
$input = file_get_contents('php://input');
$json_data = json_decode($input, true);
$data = $json_data ?: $_POST;

// Нормализация имен полей
$name = trim($data['name'] ?? $data['userName'] ?? $data['firstName'] ?? $data['username'] ?? '');
$phone = trim($data['phone'] ?? $data['userPhone'] ?? $data['mobile'] ?? $data['telephone'] ?? $data['tel'] ?? '');
$email = trim($data['email'] ?? $data['userEmail'] ?? $data['e-mail'] ?? $data['mail'] ?? '');
$form_type = $data['form_type'] ?? $data['form_name'] ?? $data['type'] ?? $data['source'] ?? 'universal';
$page_url = $data['page_url'] ?? $data['page'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Валидация
if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Логирование заявки
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\tIP:$ip\n";
file_put_contents(FORM_LOG, $log_entry, FILE_APPEND);

// Отправка в Telegram
$telegram_sent = false;
if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
    $message = "📋 <b>Новая заявка с сайта</b>\n\n";
    $message .= "👤 <b>Имя:</b> " . ($name ?: 'не указано') . "\n";
    $message .= "📞 <b>Телефон:</b> $phone\n";
    if ($email) $message .= "📧 <b>Email:</b> $email\n";
    if ($form_type && $form_type != 'universal') $message .= "📝 <b>Форма:</b> $form_type\n";
    if ($page_url) $message .= "🔗 <b>Страница:</b> " . substr($page_url, 0, 50) . "\n";
    $message .= "🌐 <b>IP:</b> $ip\n";
    $message .= "🕐 <b>Время:</b> " . date('d.m.Y H:i:s');
    
    $telegram_url = "https://api.telegram.org/bot" . TELEGRAM_TOKEN . "/sendMessage";
    $post_data = [
        'chat_id' => TELEGRAM_CHAT_ID,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init($telegram_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $telegram_sent = ($http_code == 200);
    
    // Логируем результат Telegram
    $tg_log = date('d.m.Y H:i:s') . "\tmaster\t" . 
              ($telegram_sent ? 'SUCCESS' : "FAILED:$http_code") . "\t" .
              "$phone\t$form_type\n";
    file_put_contents(TELEGRAM_LOG, $tg_log, FILE_APPEND);
}

// Email отправка (упрощенная реализация)
$email_sent = false;
if (ADMIN_EMAIL && $email) {
    $subject = "Новая заявка с сайта fattoria.by";
    $email_message = "Имя: $name\n";
    $email_message .= "Телефон: $phone\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Форма: $form_type\n";
    $email_message .= "Страница: $page_url\n";
    $email_message .= "IP: $ip\n";
    $email_message .= "Время: " . date('d.m.Y H:i:s');
    
    $headers = "From: no-reply@fattoria.by\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    $email_sent = @mail(ADMIN_EMAIL, $subject, $email_message, $headers);
}

// Ответ для фронтенда и мониторинга
echo json_encode([
    'success' => true,
    'message' => 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'details' => [
        'telegram_sent' => $telegram_sent,
        'email_sent' => $email_sent,
        'form_type' => $form_type,
        'timestamp' => date('Y-m-d H:i:s')
    ],
    'version' => 'master-1.0'
]);
?>
