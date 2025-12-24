<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$action = $_GET['action'] ?? 'status';

switch ($action) {
    case 'status':
        $status = [
            'api' => 'online',
            'telegram' => file_exists('telegram-send.log') ? 'active' : 'inactive',
            'email' => file_exists('email-final.log') ? 'active' : 'inactive',
            'forms' => file_exists('form-final.log') ? 'active' : 'inactive',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        echo json_encode($status);
        break;
        
    case 'recent_forms':
        $log_file = 'form-final.log';
        $lines = [];
        
        if (file_exists($log_file)) {
            $content = file($log_file, FILE_IGNORE_NEW_LINES);
            $lines = array_slice($content, -20); // Последние 20 записей
        }
        
        echo json_encode([
            'count' => count($lines),
            'forms' => $lines,
            'total' => count(file($log_file, FILE_IGNORE_NEW_LINES)) ?? 0
        ]);
        break;
        
    case 'telegram_logs':
        $log_file = 'telegram-send.log';
        $lines = [];
        
        if (file_exists($log_file)) {
            $content = file($log_file, FILE_IGNORE_NEW_LINES);
            $lines = array_slice($content, -10);
        }
        
        echo json_encode([
            'telegram' => $lines
        ]);
        break;
        
    default:
        echo json_encode(['error' => 'Invalid action']);
}
?>
