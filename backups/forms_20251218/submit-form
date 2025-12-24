<?php
header('Content-Type: application/json');

$input_data = file_get_contents('php://input');
$request_id = md5($_SERVER['REMOTE_ADDR'] . $input_data);
$lock_file = "/tmp/form_lock_$request_id";

if (file_exists($lock_file)) {
    $lock_time = filemtime($lock_file);
    if (time() - $lock_time < 5) {
        echo json_encode(['success' => false, 'message' => 'Подождите 5 секунд']);
        exit;
    }
    unlink($lock_file);
}
touch($lock_file);

$data = json_decode($input_data, true) ?: $_POST;
$script_name = basename($_SERVER['PHP_SELF'], '.php');
$form_type = str_replace('submit-', '', $script_name);

$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');

if (empty($phone)) {
    unlink($lock_file);
    echo json_encode(['success' => false, 'message' => 'Укажите телефон']);
    exit;
}

$timestamp = date('d.m.Y H:i:s');

// Логи
file_put_contents(__DIR__ . '/../form-final.log', 
    "$timestamp\t$name\t$phone\t$email\t" . ($data['message'] ?? '') . "\t" . ($data['source'] ?? '') . "\n", 
    FILE_APPEND);

// Telegram
$telegram_token = "8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU";
$telegram_chat_id = "8138312997";
$telegram_text = "✅ Новая заявка с сайта fattoria.by%0A%0A👤 Имя: $name%0A📞 Телефон: $phone%0A📧 Email: " . ($email ?: "не указан") . "%0A📝 Форма: $form_type%0A🕒 Время: $timestamp%0A🌐 Страница: " . ($data['source'] ?? 'не указана');
$telegram_url = "https://api.telegram.org/bot{$telegram_token}/sendMessage?chat_id={$telegram_chat_id}&text={$telegram_text}&parse_mode=HTML";
@file_get_contents($telegram_url);
file_put_contents(__DIR__ . '/../telegram-send.log', "$timestamp\tTelegram sent\n", FILE_APPEND);

// Google Sheets
$google_url = "https://script.google.com/macros/s/AKfycbxWu2KdWiLNapj5ywD2lSqkQLFF17so5jEyjLYXrrcnY-SUjjVPHsZuwohhRyfXjSd5/exec";
$google_data = ['timestamp' => $timestamp, 'name' => $name, 'phone' => $phone, 'email' => $email, 'form_type' => $form_type, 'source' => $data['source'] ?? 'fattoria.by'];
$ch = curl_init($google_url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($google_data),
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 3
]);
curl_exec($ch);
curl_close($ch);
file_put_contents(__DIR__ . '/../google-forms-final.log', "$timestamp\tGOOGLE API SENT: $name, $phone, $form_type\n", FILE_APPEND);

// Email
$to = "anfattoriya@gmail.com";
$subject = "Заявка с fattoria.by: $name";
$body = "Имя: $name\nТелефон: $phone\nEmail: " . ($email ?: "не указан") . "\nФорма: $form_type\nИсточник: " . ($data['source'] ?? 'не указан') . "\nВремя: $timestamp";
$headers = "From: info@fattoria.by\r\n";
@mail($to, $subject, $body, $headers);
file_put_contents(__DIR__ . '/../email-final.log', "$timestamp\tEMAIL SENT: $name, $phone, $form_type\n", FILE_APPEND);

// Ответ (ТОЛЬКО ОДИН JSON!)
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
], JSON_UNESCAPED_UNICODE);

// Cleanup
exec("sleep 10 && rm -f '$lock_file' 2>/dev/null &");
?>
