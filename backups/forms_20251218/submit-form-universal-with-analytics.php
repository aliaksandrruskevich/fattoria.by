<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Загружаем конфиг
$config_file = __DIR__ . '/../.env_config.php';
if (file_exists($config_file)) {
    require_once $config_file;
} else {
    define('TELEGRAM_BOT_TOKEN', '8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU');
    define('TELEGRAM_CHAT_ID', '8138312997');
    define('ADMIN_EMAIL', 'anfattoriya@gmail.com');
}

$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$form_type = $data['form_type'] ?? 'universal';
$source = $data['source'] ?? ($data['page_url'] ?? 'direct');
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$client_id = $data['client_id'] ?? '';

// Валидация
if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Логируем
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$source\t$page_url\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// ========== КОД ДЛЯ ОТПРАВКИ В АНАЛИТИКУ ==========
$analytics_code = "";

// 1. GOOGLE ANALYTICS 4 (GA4) - ID: G-C279E20DBY
$ga4_code = "
<script>
// Отправка события в GA4
if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submit', {
        'event_category': 'form',
        'event_label': '$form_type',
        'value': 1,
        'form_name': '$name',
        'form_type': '$form_type',
        'phone': '$phone',
        'source': '$source',
        'page_url': '$page_url'
    });
    
    console.log('✅ GA4: событие form_submit отправлено');
}

// Для Google Ads конверсий (если есть функция)
if (typeof gtag !== 'undefined' && typeof gtag_report_conversion === 'function') {
    gtag_report_conversion();
}
</script>
";

// 2. Яндекс.Метрика - ID: 105466180
$yandex_code = "
<script>
// Отправка цели в Яндекс.Метрику
if (typeof ym !== 'undefined') {
    ym(105466180, 'reachGoal', 'FORM_SUBMIT', {
        form_type: '$form_type',
        form_name: '$name',
        phone: '$phone',
        source: '$source',
        page_url: '$page_url'
    });
    console.log('✅ Яндекс.Метрика: цель FORM_SUBMIT отправлена');
}

// Альтернативный вариант (для старых счетчиков)
if (typeof yaCounter105466180 !== 'undefined') {
    yaCounter105466180.reachGoal('FORM_SUBMIT', {
        form_type: '$form_type',
        form_name: '$name',
        phone: '$phone'
    });
}
</script>
";

// Объединяем код аналитики
$analytics_code = $ga4_code . $yandex_code;

// ========== TELEGRAM И EMAIL (оставляем существующую логику) ==========
$telegram_sent = false;
$telegram_error = '';

if (defined('TELEGRAM_BOT_TOKEN') && defined('TELEGRAM_CHAT_ID')) {
    $text = "✅ Новая заявка с сайта fattoria.by\n\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($email)) $text .= "📧 Email: $email\n";
    if (!empty($form_type)) $text .= "📝 Форма: $form_type\n";
    $text .= "🔗 Источник: $source\n";
    $text .= "🌐 Страница: " . (strlen($page_url) > 50 ? substr($page_url, 0, 47) . '...' : $page_url) . "\n";
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
    $subject = "Новая заявка: " . (strlen($name) > 20 ? substr($name, 0, 17) . '...' : $name);
    $message = "НОВАЯ ЗАЯВКА С САЙТА:\n\n";
    $message .= "Имя: $name\n";
    $message .= "Телефон: $phone\n";
    if (!empty($email)) $message .= "Email: $email\n";
    $message .= "Тип формы: $form_type\n";
    $message .= "Источник: $source\n";
    $message .= "Страница: $page_url\n";
    $message .= "Время: " . date('d.m.Y H:i:s') . "\n";
    $message .= "\n--\nСистема уведомлений fattoria.by";
    
    $headers = "From: no-reply@fattoria.by\r\n";
    $headers .= "Reply-To: no-reply@fattoria.by\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    $email_sent = @mail(ADMIN_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, $headers);
    
    // Логируем результат Email
    $email_log = date('d.m.Y H:i:s') . "\t";
    $email_log .= $email_sent ? "EMAIL SENT: $name, $phone, $form_type\n" : "EMAIL FAILED: $name, $phone\n";
    file_put_contents(__DIR__ . '/../email-final.log', $email_log, FILE_APPEND);
}

// ========== ВОЗВРАЩАЕМ ОТВЕТ ==========
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша заявка отправлена.',
    'timestamp' => date('Y-m-d H:i:s'),
    'notifications' => [
        'telegram' => $telegram_sent,
        'email' => $email_sent,
        'analytics_sent' => true
    ],
    'analytics' => [
        'google' => ['id' => 'G-C279E20DBY', 'event' => 'form_submit'],
        'yandex' => ['id' => '105466180', 'goal' => 'FORM_SUBMIT']
    ],
    'tracking_code' => $analytics_code
]);
?>
