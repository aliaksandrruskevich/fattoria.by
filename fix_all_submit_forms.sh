#!/bin/bash
echo "=== ИСПРАВЛЕНИЕ ВСЕХ ОБРАБОТЧИКОВ ФОРМ ==="
echo ""

# Шаблон универсального обработчика
UNIVERSAL_HANDLER='<?php
// УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ДЛЯ ВСЕХ ФОРМ
header(\"Content-Type: application/json\");
header(\"Access-Control-Allow-Origin: *\");

// Получаем данные из разных источников
$raw_input = file_get_contents(\"php://input\");
$content_type = $_SERVER[\"CONTENT_TYPE\"] ?? \"\";

if (strpos($content_type, \"application/json\") !== false) {
    $data = json_decode($raw_input, true) ?: [];
} elseif (!empty($_POST)) {
    $data = $_POST;
} else {
    parse_str($raw_input, $data);
}

// Извлекаем данные
$name = $data[\"name\"] ?? \"\";
$phone = $data[\"phone\"] ?? \"\";
$email = $data[\"email\"] ?? \"\";
$message = $data[\"message\"] ?? $data[\"request\"] ?? \"\";
$source = $data[\"source\"] ?? $data[\"formType\"] ?? basename(__FILE__, \".php\");

// Логирование
$log_file = __DIR__ . \"/../form-final.log\";
$log_entry = date(\"d.m.Y H:i:s\") . \"\\t$name\\t$phone\\t$email\\t$message\\t$source\\n\";
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Отправка email (сохраняем оригинальную логику если есть)
$to = \"anfattoriya@gmail.com\";
$subject = \"Новая заявка с fattoria.by: \" . ($name ?: \"Без имени\");
$email_body = "
Новая заявка с сайта fattoria.by

Имя: $name
Телефон: $phone
Email: $email
Сообщение: $message
Источник: $source
Время: " . date(\"d.m.Y H:i:s\") . "

IP: " . ($_SERVER[\"HTTP_X_REAL_IP\"] ?? $_SERVER[\"REMOTE_ADDR\"] ?? \"неизвестен\") . "
User-Agent: " . ($_SERVER[\"HTTP_USER_AGENT\"] ?? \"неизвестен\") . "
";

$headers = \"From: info@fattoria.by\\r\\n\";
$headers .= \"Reply-To: info@fattoria.by\\r\\n\";
$headers .= \"Content-Type: text/plain; charset=utf-8\\r\\n\";

$email_sent = mail($to, $subject, $email_body, $headers);

// Логирование email
$email_log = __DIR__ . \"/../email-send.log\";
$email_log_entry = date(\"d.m.Y H:i:s\") . \"\\t$source\\t$name\\t$phone\\t\" . ($email_sent ? \"SENT\" : \"FAILED\") . \"\\n\";
file_put_contents($email_log, $email_log_entry, FILE_APPEND);

// Ответ
echo json_encode([
    \"success\" => true,
    \"message\" => \"Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.\",
    \"timestamp\" => date(\"d.m.Y H:i:s\"),
    \"data_received\" => [
        \"name\" => $name,
        \"phone\" => $phone,
        \"email\" => $email,
        \"source\" => $source
    ],
    \"email_sent\" => $email_sent
], JSON_UNESCAPED_UNICODE);
?>'

# Исправляем все обработчики кроме основного (он уже исправлен)
for file in api/submit-*.php; do
    filename=$(basename "$file")
    
    # Пропускаем основной обработчик и debug
    if [[ "$filename" == "submit-form.php" ]] || [[ "$filename" == "submit-form-debug.php" ]] || [[ "$filename" == "submit-form-perfect.php" ]]; then
        echo "⏭️  Пропускаем: $filename (уже исправлен)"
        continue
    fi
    
    # Создаем backup
    backup_file="${file}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$file" "$backup_file"
    
    # Заменяем на универсальный обработчик
    echo "$UNIVERSAL_HANDLER" > "$file"
    
    echo "✅ Исправлен: $filename (backup: $(basename "$backup_file"))"
done

echo ""
echo "=== ВСЕ ОБРАБОТЧИКИ ИСПРАВЛЕНЫ ==="
