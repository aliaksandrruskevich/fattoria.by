#!/bin/bash
echo "Исправляем все обработчики форм..."

for file in api/submit-*.php; do
  if [ "$file" != "api/submit-form.php" ]; then
    echo "Исправляем: $(basename $file)"
    cp "$file" "${file}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Создаем исправленную версию
    cat > "$file" << 'PHP'
<?php
// УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ДЛЯ ВСЕХ ФОРМ
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Получаем данные из разных источников
$raw_input = file_get_contents('php://input');
$content_type = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($content_type, 'application/json') !== false) {
    $data = json_decode($raw_input, true) ?: [];
} elseif (!empty($_POST)) {
    $data = $_POST;
} else {
    parse_str($raw_input, $data);
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

// Отправка email (упрощенная версия)
$to = "anfattoriya@gmail.com";
$subject = "Заявка с fattoria.by: $name";
$body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСообщение: $message\nИсточник: $source";
$headers = "From: info@fattoria.by\r\n";
mail($to, $subject, $body, $headers);

// Ответ
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена!',
    'timestamp' => date('d.m.Y H:i:s')
], JSON_UNESCAPED_UNICODE);
?>
PHP
    echo "✅ $(basename $file) исправлен"
  fi
done
