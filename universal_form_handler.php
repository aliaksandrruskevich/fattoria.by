<?php
header('Content-Type: application/json; charset=utf-8');

// Простой обработчик форм
$response = array(
    'success' => true,
    'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'timestamp' => date('d.m.Y H:i:s'),
    'handler_version' => 'CLEAN_1.0'
);

// Логируем запрос
$log_data = array(
    'time' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'data' => $_POST,
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'direct'
);

@file_put_contents('logs/form_submissions.log', 
    json_encode($log_data, JSON_UNESCAPED_UNICODE) . PHP_EOL, 
    FILE_APPEND);

$response['log_written'] = true;

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
