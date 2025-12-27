<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Конфигурация
define('TELEGRAM_TOKEN', '8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU');
define('TELEGRAM_CHAT_ID', '8138312997');
define('ADMIN_EMAIL', 'anfattoriya@gmail.com');
define('FORM_LOG', '/home/fattoriaby/public_html/form-final.log');
define('TELEGRAM_LOG', '/home/fattoriaby/public_html/telegram-send.log');

// Получаем данные
$input = file_get_contents('php://input');
$json_data = json_decode($input, true);
$data = $json_data ?: $_POST;

$name = trim($data['name'] ?? $data['userName'] ?? $data['firstName'] ?? '');
$phone = trim($data['phone'] ?? $data['userPhone'] ?? $data['mobile'] ?? $data['telephone'] ?? '');
$email = trim($data['email'] ?? $data['userEmail'] ?? $data['e-mail'] ?? '');
$form_type = $data['form_type'] ?? $data['form_name'] ?? $data['type'] ?? 'universal';
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
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
$telegram_response = '';

if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
    $message = "📋 Новая заявка с сайта\n\n";
    $message .= "👤 Имя: $name\n";
    $message .= "📞 Телефон: $phone\n";
    if ($email) $message .= "📧 Email: $email\n";
    if ($form_type && $form_type != 'universal') $message .= "📝 Форма: $form_type\n";
    if ($page_url) $message .= "🔗 Страница: $page_url\n";
    $message .= "🌐 IP: $ip\n";
    $message .= "🕐 " . date('d.m.Y H:i:s');
    
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
    $error = curl_error($ch);
    curl_close($ch);
    
    $telegram_sent = ($http_code == 200);
    $telegram_response = $response;
    
    // Логируем результат
    $tg_log = date('d.m.Y H:i:s') . "\t" . 
              ($telegram_sent ? 'SUCCESS' : "FAILED:$http_code") . "\t" .
              "$phone\t$form_type\n";
    file_put_contents(TELEGRAM_LOG, $tg_log, FILE_APPEND);
}

// Email отправка (пока заглушка)
$email_sent = false;

// Ответ
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена!',
    'details' => [
        'telegram_sent' => $telegram_sent,
        'email_sent' => $email_sent,
        'form_type' => $form_type,
        'timestamp' => date('Y-m-d H:i:s')
    ]
]);
?>
