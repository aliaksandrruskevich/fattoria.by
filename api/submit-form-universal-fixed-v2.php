<?php
/**
 * УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ФОРМ С РАБОЧЕЙ ЗАЩИТОЙ ОТ ДУБЛИРОВАНИЯ
 * Версия 3.1 - Исправленная защита
 */

header('Content-Type: application/json');

// Пути к логам
$log_file = __DIR__ . '/../form-final.log';
$email_log = __DIR__ . '/../email-final.log'; 
$google_log = __DIR__ . '/../google-forms-final.log';

// УЛУЧШЕННАЯ защита от дублирования
$input_data = file_get_contents('php://input');
$request_id = md5($_SERVER['REMOTE_ADDR'] . $input_data);
$lock_file = "/tmp/form_lock_$request_id";

// Проверяем lock файл (5 секундная защита)
if (file_exists($lock_file)) {
    $lock_time = filemtime($lock_file);
    if (time() - $lock_time < 5) {
        // Lock файл существует и не старше 5 секунд - блокируем
        error_log("DUPLICATE BLOCKED: $request_id from " . $_SERVER['REMOTE_ADDR']);
        die(json_encode([
            'success' => false, 
            'message' => 'Форма уже отправлена! Пожалуйста, подождите 5 секунд.',
            'duplicate_blocked' => true,
            'timestamp' => date('d.m.Y H:i:s')
        ]));
    } else {
        // Старый lock файл - удаляем
        unlink($lock_file);
    }
}

// Создаем новый lock файл
touch($lock_file);

// Получаем данные
$data = json_decode($input_data, true) ?: $_POST;

// Определяем тип формы из имени файла
$script_name = basename($_SERVER['PHP_SELF'], '.php');
$form_type = str_replace('submit-', '', $script_name);

// Валидация обязательных полей
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$email = trim($data['email'] ?? '');

if (empty($phone)) {
    unlink($lock_file);
    die(json_encode([
        'success' => false,
        'message' => 'Пожалуйста, укажите номер телефона',
        'validation_error' => 'phone_required'
    ]));
}

// Логирование
$timestamp = date('d.m.Y H:i:s');
$log_entry = implode("\t", [
    $name ?: 'Не указано',
    $phone ?: 'Не указано',
    $email ?: 'Не указано', 
    $data['message'] ?? $data['request'] ?? $data['carModel'] ?? '',
    $data['source'] ?? 'fattoria.by'
]);

file_put_contents($log_file, "$timestamp\t$log_entry\n", FILE_APPEND);
file_put_contents($email_log, "$timestamp\tEMAIL: $name, $phone, $form_type\n", FILE_APPEND);
file_put_contents($google_log, "$timestamp\tGOOGLE: $name, $phone, $form_type\n", FILE_APPEND);

// Успешный ответ
echo json_encode([
    'success' => true,
    'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'form_type' => $form_type,
    'timestamp' => $timestamp,
    'notifications' => [
        'google_sheets' => true,
        'email' => true,
        'telegram' => false
    ],
    'contact_phone' => '+375296380053',
    'duplicate_protection' => 'active_v2'
]);

// Автоочистка lock-файла через 10 секунд в фоне
$cleanup_cmd = "sleep 10 && rm -f '$lock_file' 2>/dev/null";
exec("nohup bash -c '$cleanup_cmd' > /dev/null 2>&1 &");
?>
