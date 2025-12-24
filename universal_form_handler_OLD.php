<?php
// МИНИМАЛЬНЫЙ РАБОЧИЙ ОБРАБОТЧИК ФОРМ
header('Content-Type: application/json');

// Простой парсинг данных
if (!empty($_POST)) {
    $data = $_POST;
} else {
    $input = file_get_contents('php://input');
    if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        $data = json_decode($input, true) ?: [];
    } else {
        parse_str($input, $data);
    }
}

// Извлекаем данные
$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$message = $data['message'] ?? '';
$source = $data['source'] ?? basename(__FILE__, '.php');

// Логирование
$log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$email\t$message\t$source\n";
file_put_contents(__DIR__ . '/../form-final.log', $log_entry, FILE_APPEND);

// Отправка email (упрощенная)
$to = "anfattoriya@gmail.com";
$subject = "Заявка с fattoria.by: $name";
$body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСообщение: $message\nИсточник: $source";
$headers = "From: info@fattoria.by\r\n";
$email_sent = mail($to, $subject, $body, $headers);

// Логирование email
$email_log = date('d.m.Y H:i:s') . "\t$source\t$name\t$phone\t" . ($email_sent ? 'SENT' : 'FAILED') . "\n";
file_put_contents(__DIR__ . '/../email-send.log', $email_log, FILE_APPEND);

// Ответ
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'timestamp' => date('d.m.Y H:i:s')
], JSON_UNESCAPED_UNICODE);
?>
