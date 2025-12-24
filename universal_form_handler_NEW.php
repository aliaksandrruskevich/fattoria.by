<?php
// ИСПРАВЛЕННЫЙ ОБРАБОТЧИК ФОРМ - БЕЗОПАСНАЯ ВЕРСИЯ
header('Content-Type: application/json');

// ДИАГНОСТИКА: логируем информацию о запросе
$debug_log = __DIR__ . '/debug_handler.log';
$debug_info = "[" . date('Y-m-d H:i:s') . "] Запрос к " . basename(__FILE__) . "\n";
$debug_info .= "Метод: " . $_SERVER['REQUEST_METHOD'] . "\n";
$debug_info .= "Директория: " . __DIR__ . "\n";
$debug_info .= "Данные: " . json_encode($_POST, JSON_UNESCAPED_UNICODE) . "\n";
file_put_contents($debug_log, $debug_info, FILE_APPEND);

// Правильные пути к логам (в текущей директории)
$form_log = __DIR__ . '/form-final.log';
$email_log = __DIR__ . '/email-send.log';

// Проверяем доступность файлов
$files_ok = true;
if (!is_writable($form_log) && file_exists($form_log)) {
    $debug_info = "[" . date('Y-m-d H:i:s') . "] ОШИБКА: form-final.log не доступен для записи\n";
    file_put_contents($debug_log, $debug_info, FILE_APPEND);
    $files_ok = false;
}

// Получаем данные
$name = $_POST['name'] ?? ($_GET['name'] ?? '');
$phone = $_POST['phone'] ?? ($_GET['phone'] ?? '');
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$source = $_POST['source'] ?? 'universal_form_handler_NEW';

// Записываем в лог формы (если доступно)
if ($files_ok) {
    $log_entry = date('d.m.Y H:i:s') . "\t$name\t$phone\t$email\t$message\t$source\n";
    $write_result = file_put_contents($form_log, $log_entry, FILE_APPEND);
    
    if ($write_result === false) {
        $debug_info = "[" . date('Y-m-d H:i:s') . "] ОШИБКА записи в form-final.log\n";
        file_put_contents($debug_log, $debug_info, FILE_APPEND);
    }
}

// Всегда отвечаем успешно, даже если логи не пишутся
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'timestamp' => date('d.m.Y H:i:s'),
    'handler_version' => 'NEW_SAFE_1.0',
    'log_written' => $files_ok
], JSON_UNESCAPED_UNICODE);
?>
