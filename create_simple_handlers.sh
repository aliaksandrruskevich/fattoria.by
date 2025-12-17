#!/bin/bash
echo "=== СОЗДАНИЕ ПРОСТЫХ ОБРАБОТЧИКОВ ==="

SIMPLE_HANDLER='<?php
// ПРОСТОЙ РАБОЧИЙ ОБРАБОТЧИК
header("Content-Type: application/json");

// Получаем данные
if (!empty($_POST)) {
    $data = $_POST;
} else {
    $input = file_get_contents("php://input");
    if (strpos($_SERVER["CONTENT_TYPE"] ?? "", "application/json") !== false) {
        $data = json_decode($input, true) ?: [];
    } else {
        parse_str($input, $data);
    }
}

// Извлекаем
$name = $data["name"] ?? "";
$phone = $data["phone"] ?? "";
$email = $data["email"] ?? "";
$message = $data["message"] ?? "";
$source = $data["source"] ?? basename(__FILE__, ".php");

// Логируем
$log = date("d.m.Y H:i:s") . "\t$name\t$phone\t$email\t$message\t$source\n";
file_put_contents(__DIR__ . "/../form-final.log", $log, FILE_APPEND);

// Отправляем email
$to = "anfattoriya@gmail.com";
$subject = "Заявка: $name";
$body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСообщение: $message\nИсточник: $source";
$headers = "From: info@fattoria.by\r\n";
mail($to, $subject, $body, $headers);

// Ответ
echo json_encode([
    "success" => true,
    "message" => "Заявка отправлена!",
    "timestamp" => date("d.m.Y H:i:s")
], JSON_UNESCAPED_UNICODE);
?>'

# Создаем простые обработчики для проблемных форм
PROBLEM_FORMS=(
    "newbuilding"
    "test-drive" 
    "buyer"
    "seller"
    "footer"
    "modal"
    "project"
    "trust-callback"
)

for form in "${PROBLEM_FORMS[@]}"; do
    echo "$SIMPLE_HANDLER" > "api/submit-${form}.php"
    echo "✅ Создан: submit-${form}.php"
done

echo ""
echo "=== ПРОСТЫЕ ОБРАБОТЧИКИ СОЗДАНЫ ==="
