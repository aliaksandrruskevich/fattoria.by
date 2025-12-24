<?php
// DEBUG ОБРАБОТЧИК ДЛЯ ВСЕХ ФОРМ
header('Content-Type: application/json');

$debug_log = __DIR__ . '/../form-debug-all.log';

// Собираем всю информацию
$debug_data = "=== DEBUG [" . date('Y-m-d H:i:s') . "] ===\n";
$debug_data .= "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "\n";
$debug_data .= "CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set') . "\n";
$debug_data .= "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n\n";

// Все возможные источники данных
$debug_data .= "=== \$_POST ===\n";
$debug_data .= print_r($_POST, true) . "\n";

$debug_data .= "=== \$_GET ===\n";
$debug_data .= print_r($_GET, true) . "\n";

$raw_input = file_get_contents('php://input');
$debug_data .= "=== php://input ===\n";
$debug_data .= $raw_input . "\n\n";

$debug_data .= "=== Все \$_SERVER ===\n";
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'HTTP_') === 0 || in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'])) {
        $debug_data .= "$key: $value\n";
    }
}

$debug_data .= "\n=================================\n\n";

// Записываем в лог
file_put_contents($debug_log, $debug_data, FILE_APPEND);

// Пытаемся найти данные разными способами
$data = [];

// 1. Из JSON
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode($raw_input, true) ?: [];
}

// 2. Из FormData
if (empty($data) && !empty($_POST)) {
    $data = $_POST;
}

// 3. Парсим вручную
if (empty($data) && !empty($raw_input)) {
    parse_str($raw_input, $data);
}

// 4. Ищем данные в любом поле
$all_data = array_merge($_GET, $_POST, $data, json_decode($raw_input, true) ?: []);

// Ищем возможные имена полей
$possible_names = ['name', 'username', 'user_name', 'firstname', 'firstName'];
$possible_phones = ['phone', 'telephone', 'tel', 'phone_number', 'mobile'];
$possible_emails = ['email', 'mail', 'e-mail'];

$name = '';
$phone = '';
$email = '';

foreach ($possible_names as $field) {
    if (!empty($all_data[$field])) {
        $name = $all_data[$field];
        break;
    }
}

foreach ($possible_phones as $field) {
    if (!empty($all_data[$field])) {
        $phone = $all_data[$field];
        break;
    }
}

foreach ($possible_emails as $field) {
    if (!empty($all_data[$field])) {
        $email = $all_data[$field];
        break;
    }
}

// Логируем что нашли
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$email\t" . ($_SERVER['HTTP_REFERER'] ?? '') . "\tdebug\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// Отвечаем
echo json_encode([
    'success' => true,
    'message' => 'Debug: Данные получены',
    'debug' => [
        'found_name' => $name,
        'found_phone' => $phone,
        'found_email' => $email,
        'all_data_keys' => array_keys($all_data),
        'raw_input_first_100' => substr($raw_input, 0, 100)
    ],
    'timestamp' => date('d.m.Y H:i:s')
], JSON_UNESCAPED_UNICODE);
?>
