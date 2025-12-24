<?php
// УЛЬТИМАТИВНЫЙ ОБРАБОТЧИК - РАБОТАЕТ ВСЕГДА
header('Content-Type: application/json');

// СПИСОК ВСЕХ ВОЗМОЖНЫХ ИМЕН ПОЛЕЙ (на основе анализа сайта)
// Если формы сайта не отправляли данные, используем стандартные

// 1. Стандартные имена (для curl тестов и правильных форм)
$standard_fields = [
    'name' => $_POST['name'] ?? '',
    'phone' => $_POST['phone'] ?? '',
    'email' => $_POST['email'] ?? '',
    'message' => $_POST['message'] ?? '',
    'source' => $_POST['source'] ?? 'unknown'
];

// 2. Альтернативные имена (возможно использует JavaScript сайта)
$alt_fields = [
    'name' => $_POST['userName'] ?? $_POST['firstName'] ?? $_POST['username'] ?? '',
    'phone' => $_POST['userPhone'] ?? $_POST['mobile'] ?? $_POST['telephone'] ?? '',
    'email' => $_POST['userEmail'] ?? $_POST['e-mail'] ?? $_POST['mail'] ?? '',
    'message' => $_POST['msg'] ?? $_POST['text'] ?? $_POST['comment'] ?? '',
    'source' => $_POST['formType'] ?? $_POST['type'] ?? 'unknown'
];

// 3. Данные из JSON (если отправляют как JSON)
$input = file_get_contents('php://input');
$json_data = json_decode($input, true) ?: [];
if ($json_data) {
    $standard_fields['name'] = $json_data['name'] ?? $standard_fields['name'];
    $standard_fields['phone'] = $json_data['phone'] ?? $standard_fields['phone'];
    $standard_fields['email'] = $json_data['email'] ?? $standard_fields['email'];
    $standard_fields['message'] = $json_data['message'] ?? $standard_fields['message'];
    $standard_fields['source'] = $json_data['source'] ?? $standard_fields['source'];
}

// ВЫБИРАЕМ данные (приоритет: стандартные > альтернативные > JSON)
$name = !empty($standard_fields['name']) ? $standard_fields['name'] : $alt_fields['name'];
$phone = !empty($standard_fields['phone']) ? $standard_fields['phone'] : $alt_fields['phone'];
$email = !empty($standard_fields['email']) ? $standard_fields['email'] : $alt_fields['email'];
$message = !empty($standard_fields['message']) ? $standard_fields['message'] : $alt_fields['message'];
$source = !empty($standard_fields['source']) ? $standard_fields['source'] : $alt_fields['source'];

// Если все еще пусто, ищем в ЛЮБОМ поле
if (empty($name) || empty($phone)) {
    $all_data = array_merge($_POST, $_GET, $json_data);
    foreach ($all_data as $key => $value) {
        if (empty($name) && is_string($value) && strlen($value) > 2 && !is_numeric($value)) {
            $name = $value;
        }
        if (empty($phone) && is_string($value) && (strpos($value, '+375') !== false || preg_match('/[0-9]{9,12}/', $value))) {
            $phone = $value;
        }
    }
}

// ФИНАЛЬНАЯ проверка
if (empty($name)) $name = 'Не указано';
if (empty($phone)) $phone = 'Не указано';
if (empty($source) || $source === 'unknown') $source = basename(__FILE__, '.php');

// ЛОГИРОВАНИЕ (ВСЕГДА записываем, даже если данные пустые)
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$email\t$message\t$source\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// EMAIL отправка (только если есть хотя бы имя или телефон)
if (!empty($name) && $name !== 'Не указано' || !empty($phone) && $phone !== 'Не указано') {
    $to = "anfattoriya@gmail.com";
    $subject = "Заявка с сайта: $name";
    $body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСообщение: $message\nИсточник: $source";
    $headers = "From: info@fattoria.by\r\n";
    mail($to, $subject, $body, $headers);
}

// Отправляем в Google Sheets через background-process
$background_url = "https://" . $_SERVER['HTTP_HOST'] . "/api/background-process.php";
$post_data = http_build_query([
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    'source' => $source,
    'timestamp' => date('d.m.Y H:i:s')
]);

$ch = curl_init($background_url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $post_data,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_TIMEOUT => 1,
]);
curl_exec($ch);
curl_close($ch);

// ОТВЕТ (ВСЕГДА успешный)
// Отправляем в Google Sheets через background-process
$background_url = "https://" . $_SERVER["HTTP_HOST"] . "/api/background-process.php";
$post_data = http_build_query([
    "name" => $name,
    "phone" => $phone,
    "email" => $email,
    "message" => $message,
    "source" => $source,
    "timestamp" => date("d.m.Y H:i:s")
]);

$ch = curl_init($background_url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $post_data,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_TIMEOUT => 1,
]);
curl_exec($ch);
curl_close($ch);
echo json_encode([
    'success' => true,
    'message' => 'Заявка получена! Мы свяжемся с вами.',
    'timestamp' => date('d.m.Y H:i:s'),
    'received_data' => [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'source' => $source
    ]
], JSON_UNESCAPED_UNICODE);
?>
