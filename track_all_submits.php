<?php
header('Content-Type: application/json');

// Логируем ВСЁ
$log_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'unknown',
    'post_data' => $_POST,
    'get_data' => $_GET,
    'raw_input' => file_get_contents('php://input'),
    'headers' => getallheaders(),
    'server' => $_SERVER
];

$log_file = '/home/fattoriaby/debug_all_submits.log';
file_put_contents($log_file, json_encode($log_data, JSON_PRETTY_PRINT) . "\n---\n", FILE_APPEND);

// Отвечаем как обычная форма
echo json_encode([
    'success' => true,
    'message' => 'Заявка принята',
    'tracking_id' => uniqid()
]);
