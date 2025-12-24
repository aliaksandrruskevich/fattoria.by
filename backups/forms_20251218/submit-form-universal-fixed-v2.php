<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Загружаем конфиг
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

// Валидация
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Логируем заявку (ВСЕГДА ДО всех операций!)
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// Telegram отправка (с улучшенной обработкой ошибок)
$telegram_sent = false;
$telegram_error = '';

if (defined('TELEGRAM_BOT_TOKEN') && defined('TELEGRAM_CHAT_ID')) {
    $text = "✅ Новая заявка с сайта\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($form_type)) $text .= "📝 Форма: $form_type\n";
    $text .= "⏰ Время: " . date('H:i:s d.m.Y');
    
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $post_data = [
        'chat_id' => TELEGRAM_CHAT_ID,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    // Используем более надежный метод
    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => http_build_query($post_data),
            'timeout' => 3 // 3 секунды максимум
        ]
    ];
    
    try {
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        
        if ($result !== false) {
            $response = json_decode($result, true);
            if ($response['ok'] ?? false) {
                $telegram_sent = true;
            } else {
                $telegram_error = $response['description'] ?? 'Unknown error';
            }
        } else {
            $telegram_error = 'Connection failed';
        }
    } catch (Exception $e) {
        $telegram_error = $e->getMessage();
    }
    
    // Логируем результат Telegram отправки
    $tg_log = date('d.m.Y H:i:s') . "\t";
    if ($telegram_sent) {
        $tg_log .= '{"ok":true,"message":"Telegram sent"}';
    } else {
        $tg_log .= '{"ok":false,"error":"' . $telegram_error . '"}';
    }
    $tg_log .= "\n";
    file_put_contents(__DIR__ . '/../telegram-send.log', $tg_log, FILE_APPEND);
}

// Email отправка
$email_sent = false;
if (defined('ADMIN_EMAIL')) {
    $subject = "Заявка: $name";
    $message = "Имя: $name\nТелефон: $phone\nФорма: $form_type\nВремя: " . date('d.m.Y H:i:s');
    $headers = "From: no-reply@fattoria.by\r\n";
    
    $email_sent = @mail(ADMIN_EMAIL, $subject, $message, $headers);
    
    // Логируем результат email отправки
    $email_log = date('d.m.Y H:i:s') . "\t";
    $email_log .= $email_sent ? "EMAIL SENT: $name, $phone\n" : "EMAIL FAILED: $name, $phone\n";
    file_put_contents(__DIR__ . '/../email-final.log', $email_log, FILE_APPEND);
}

// Всегда возвращаем успех клиенту
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка отправлена.',
    'telegram_sent' => $telegram_sent,
    'email_sent' => $email_sent,
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
