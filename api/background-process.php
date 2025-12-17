<?php
$data = array (
  'timestamp' => '22.11.2025 16:46:38',
  'name' => 'чаша',
  'phone' => '+37589653211',
  'form_type' => 'trustCallbackForm',
  'source' => 'https://fattoria.by/index.html',
  'source_page' => '/index.html',
  'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
);

// Отправляем в Google Sheets
$google_url = "https://script.google.com/macros/s/AKfycbxWu2KdWiLNapj5ywD2lSqkQLFF17so5jEyjLYXrrcnY-SUjjVPHsZuwohhRyfXjSd5/exec";
$post_fields = http_build_query($data);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $google_url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $post_fields,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT => 3
]);
curl_exec($ch);
curl_close($ch);

// Отправляем email
$to = "anfattoriya@gmail.com";
$subject = "Новая заявка: " . ($data["form_type"] ?? "unknown");
$message = "НОВАЯ ЗАЯВКА С САЙТА:\n\n";
foreach ($data as $key => $value) {
    if (!empty($value)) {
        $message .= str_pad($key . ":", 15) . " " . $value . "\n";
    }
}
$headers = "From: webmaster@fattoria.by\r\n";
@mail($to, $subject, $message, $headers);
?>