<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// === ФИЛЬТР ТЕСТОВЫХ ЗАЯВОК (ДОБАВЛЕНО) ===
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true) ?: $_POST;

$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$form_type = $data['form_type'] ?? 'universal';

// Телефоны и имена для фильтрации
$test_phones = ['+375291112242', '80292422901', '+375291119999'];
$test_keywords = ['тест мониторинг', 'healthcheck', 'тест после'];

$is_test = false;

// Проверка телефона
if (in_array($phone, $test_phones)) {
    $is_test = true;
}

// Проверка имени
foreach ($test_keywords as $keyword) {
    if (stripos($name, $keyword) !== false) {
        $is_test = true;
        break;
    }
}

// Если тест - логируем и выходим
if ($is_test) {
    $log_data = date('Y-m-d H:i:s') . " | TEST FILTERED | $name | $phone | $form_type\n";
    file_put_contents('/home/fattoriaby/filtered_tests.log', $log_data, FILE_APPEND);
    
    // Отвечаем успехом, но не отправляем в Telegram
    echo json_encode([
        'success' => true,
        'message' => 'Тестовая заявка залогирована',
        'filtered' => true
    ]);
    exit;
}
// === КОНЕЦ ФИЛЬТРА ===

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Конфигурация аналитики
define('YANDEX_METRIKA_ID', '105466180');
define('GOOGLE_ANALYTICS_ID', 'G-W9P522GECC');

// Загружаем основной конфиг
$config_file = __DIR__ . '/../.env_config.php';
if (file_exists($config_file)) {
    require_once $config_file;
}

// 1. ПОЛУЧАЕМ ДАННЫЕ
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true) ?: $_POST;

// 2. ЛОГИРУЕМ ВХОДЯЩИЕ ДАННЫЕ (для отладки)
file_put_contents('/home/fattoriaby/form_input_debug.log',
    date('Y-m-d H:i:s') . " | DATA: " . json_encode($data) . "\n",
    FILE_APPEND);

// 3. ИЗВЛЕКАЕМ ПОЛЯ
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');
$form_type = $data['form_type'] ?? 'universal';
$page_url = $data['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '');

// 4. ВАЛИДАЦИЯ
if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// 5. ЛОГИРУЕМ УСПЕШНУЮ ЗАЯВКУ
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$form_type\t$page_url\n";
file_put_contents('/home/fattoriaby/form_final_correct.log', $log_entry, FILE_APPEND);

// 6. ОТПРАВКА В TELEGRAM
$telegram_sent = false;
if (defined('TELEGRAM_BOT_TOKEN') && defined('TELEGRAM_CHAT_ID')) {
    $telegram_message = "📨 Новая заявка с сайта:\n\nИмя: $name\nТелефон: $phone\nEmail: " . ($email ?: 'не указан') . "\nТип формы: $form_type\nСтраница: $page_url";
    
    $telegram_url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $telegram_data = ['chat_id' => TELEGRAM_CHAT_ID, 'text' => $telegram_message];
    
    $ch = curl_init($telegram_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $telegram_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $telegram_result = curl_exec($ch);
    curl_close($ch);
    
    $telegram_sent = strpos($telegram_result, '"ok":true') !== false;
    
    // Логируем результат отправки в Telegram
    file_put_contents('/home/fattoriaby/telegram_send.log',
        date('Y-m-d H:i:s') . " | Result: " . $telegram_result . "\n",
        FILE_APPEND);
}

// 7. ОТПРАВКА НА EMAIL
$email_sent = false;
if (defined('ADMIN_EMAIL')) {
    $to = ADMIN_EMAIL;
    $subject = "Новая заявка с fattoria.by: $name";
    $message = "Детали заявки:\n\nИмя: $name\nТелефон: $phone\nEmail: " . ($email ?: 'не указан') . "\nТип формы: $form_type\nСтраница: $page_url\n\nВремя: " . date('d.m.Y H:i:s');
    $headers = "From: no-reply@fattoria.by\r\n";
    $headers .= "Reply-To: no-reply@fattoria.by\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $email_sent = mail($to, $subject, $message, $headers);
    
    // Логируем результат отправки email
    file_put_contents('/home/fattoriaby/email_send.log',
        date('Y-m-d H:i:s') . " | To: $to | Sent: " . ($email_sent ? 'YES' : 'NO') . "\n",
        FILE_APPEND);
}

// 8. ВОЗВРАЩАЕМ ОТВЕТ КЛИЕНТУ
echo json_encode([
    'success' => true,
    'message' => '✅ Заявка принята! Мы свяжемся с вами в ближайшее время.',
    'form_data' => [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'form_type' => $form_type,
        'page_url' => $page_url
    ],
    'notifications' => [
        'telegram' => $telegram_sent,
        'email' => $email_sent
    ],
    'timestamp' => date('Y-m-d H:i:s')
]);
