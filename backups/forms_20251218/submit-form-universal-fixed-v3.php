<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Загружаем конфиг (используем тот же, что и v2)
$config_file = __DIR__ . '/../.env_config.php';
if (file_exists($config_file)) {
    require_once $config_file;
} else {
    // Fallback значения
    define('TELEGRAM_BOT_TOKEN', '8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU');
    define('TELEGRAM_CHAT_ID', '8138312997');
    define('ADMIN_EMAIL', 'anfattoriya@gmail.com');
}

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$form_type = $data['form_type'] ?? 'universal';
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Валидация (такая же как в v2)
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Защита от спама (упрощенная)
$spam_check = false;
$log_file = __DIR__ . '/../form-final.log';

if (file_exists($log_file)) {
    $logs = file($log_file, FILE_IGNORE_NEW_LINES);
    $last_hour = time() - 3600;
    
    foreach (array_slice($logs, -20) as $log_line) {
        if (strpos($log_line, $phone) !== false) {
            $log_time = strtotime(substr($log_line, 0, 19));
            if ($log_time > $last_hour) {
                $spam_check = true;
                break;
            }
        }
    }
}

if ($spam_check) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, подождите перед повторной отправкой']);
    exit;
}

// Логируем заявку (совместимый формат с v2)
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\tIP:$ip\n";
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Telegram отправка (ИДЕНТИЧНАЯ v2)
$telegram_sent = false;
$telegram_error = '';

if (defined('TELEGRAM_BOT_TOKEN') && defined('TELEGRAM_CHAT_ID')) {
    $text = "✅ Новая заявка с сайта fattoria.by (v3)\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($form_type)) $text .= "📝 Форма: $form_type\n";
    $text .= "🌐 IP: $ip\n";
    $text .= "⏰ Время: " . date('H:i:s d.m.Y');
    
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $post_data = [
        'chat_id' => TELEGRAM_CHAT_ID,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $telegram_sent = ($http_code === 200);
    $telegram_error = $telegram_sent ? '' : "HTTP $http_code";
    
    // Логируем результат Telegram
    $tg_log = date('d.m.Y H:i:s') . "\t";
    if ($telegram_sent) {
        $tg_log .= '{"ok":true,"message":"Telegram sent from v3"}';
    } else {
        $tg_log .= '{"ok":false,"error":"' . $telegram_error . '"}';
    }
    $tg_log .= "\n";
    file_put_contents(__DIR__ . '/../telegram-send.log', $tg_log, FILE_APPEND);
}

// Email отправка (ИДЕНТИЧНАЯ v2)
$email_sent = false;
if (defined('ADMIN_EMAIL')) {
    $subject = "Новая заявка (v3): " . (strlen($name) > 20 ? substr($name, 0, 17) . '...' : $name);
    $message = "ЗАЯВКА ИЗ API v3:\n\n";
    $message .= "Имя: $name\n";
    $message .= "Телефон: $phone\n";
    $message .= "Тип формы: $form_type\n";
    $message .= "IP адрес: $ip\n";
    $message .= "Время: " . date('d.m.Y H:i:s') . "\n";
    $message .= "\n--\nСистема уведомлений fattoria.by (v3)";
    
    $headers = "From: no-reply@fattoria.by\r\n";
    $headers .= "Reply-To: no-reply@fattoria.by\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    $email_sent = @mail(ADMIN_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, $headers);
    
    // Логируем результат Email
    $email_log = date('d.m.Y H:i:s') . "\t";
    $email_log .= $email_sent ? "EMAIL SENT (v3): $name, $phone\n" : "EMAIL FAILED (v3): $name, $phone\n";
    file_put_contents(__DIR__ . '/../email-final.log', $email_log, FILE_APPEND);
}

// Ответ клиенту (совместимый с v2)
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
    'timestamp' => date('Y-m-d H:i:s'),
    'notifications' => [
        'telegram' => $telegram_sent,
        'email' => $email_sent
    ],
    'version' => 'v3',
    'spam_protection' => 'enabled'
]);
?>
