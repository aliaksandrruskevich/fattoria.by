<?php
/**
 * УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ФОРМ - ОКОНЧАТЕЛЬНАЯ ВЕРСИЯ
 * Версия: 2.0
 * Дата: 27.12.2025
 */

// Включаем все ошибки только в режиме отладки
if (isset($_GET['debug']) || php_sapi_name() === 'cli') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ===== КОНФИГУРАЦИЯ =====
define('TELEGRAM_BOT_TOKEN', '8554923032:AAFkZ0jvKuNBIUUpZrRf1IX6allzl2PWgpU');
define('TELEGRAM_CHAT_ID', '8138312997');
define('ADMIN_EMAIL', 'anfattoriya@gmail.com');
define('SITE_NAME', 'Fattoria.by');

// Пути к логам (абсолютные)
define('LOG_DIR', '/home/fattoriaby/public_html/');
define('FORM_LOG', LOG_DIR . 'form-final.log');
define('TELEGRAM_LOG', LOG_DIR . 'telegram-send.log');
define('ERROR_LOG', LOG_DIR . 'form-errors.log');

// Настройки времени
date_default_timezone_set('Europe/Minsk');

// ===== ФУНКЦИИ =====

/**
 * Логирование ошибок
 */
function log_error($message, $data = []) {
    $entry = date('d.m.Y H:i:s') . " [ERROR] $message";
    if (!empty($data)) {
        $entry .= " | Data: " . json_encode($data, JSON_UNESCAPED_UNICODE);
    }
    $entry .= "\n";
    @file_put_contents(ERROR_LOG, $entry, FILE_APPEND);
}

/**
 * Отправка в Telegram
 */
function send_telegram($data) {
    $message = "📋 <b>Новая заявка с сайта " . SITE_NAME . "</b>\n\n";
    $message .= "👤 <b>Имя:</b> " . ($data['name'] ?: 'не указано') . "\n";
    $message .= "📞 <b>Телефон:</b> " . $data['phone'] . "\n";
    
    if (!empty($data['email'])) {
        $message .= "📧 <b>Email:</b> " . $data['email'] . "\n";
    }
    
    if (!empty($data['form_type']) && $data['form_type'] != 'universal') {
        $message .= "📝 <b>Форма:</b> " . $data['form_type'] . "\n";
    }
    
    if (!empty($data['page_url'])) {
        $message .= "🔗 <b>Страница:</b> " . substr($data['page_url'], 0, 60) . "\n";
    }
    
    $message .= "🌐 <b>IP:</b> " . $data['ip'] . "\n";
    $message .= "🕐 <b>Время:</b> " . date('d.m.Y H:i:s');
    
    $telegram_url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $post_data = [
        'chat_id' => TELEGRAM_CHAT_ID,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    
    $ch = curl_init($telegram_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $success = ($http_code == 200);
    
    // Логируем результат
    $log_entry = date('d.m.Y H:i:s') . "\t" . 
                 ($success ? 'SUCCESS' : "FAILED:$http_code") . "\t" .
                 $data['phone'] . "\t" . 
                 ($data['form_type'] ?? 'universal') . "\t" .
                 ($error ?: '') . "\n";
    @file_put_contents(TELEGRAM_LOG, $log_entry, FILE_APPEND);
    
    if (!$success) {
        log_error("Telegram отправка не удалась", [
            'http_code' => $http_code,
            'error' => $error,
            'response' => $response
        ]);
    }
    
    return $success;
}

/**
 * Отправка Email
 */
function send_email($data) {
    if (empty($data['email']) || empty(ADMIN_EMAIL)) {
        return false;
    }
    
    $subject = "Новая заявка с сайта " . SITE_NAME;
    
    $message = "Поступила новая заявка с сайта:\n\n";
    $message .= "Имя: " . ($data['name'] ?: 'не указано') . "\n";
    $message .= "Телефон: " . $data['phone'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    
    if (!empty($data['form_type'])) {
        $message .= "Тип формы: " . $data['form_type'] . "\n";
    }
    
    if (!empty($data['page_url'])) {
        $message .= "Страница: " . $data['page_url'] . "\n";
    }
    
    $message .= "IP адрес: " . $data['ip'] . "\n";
    $message .= "Время отправки: " . date('d.m.Y H:i:s') . "\n\n";
    $message .= "--\nАвтоматическое уведомление с сайта " . SITE_NAME;
    
    $headers = "From: no-reply@fattoria.by\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    $sent = @mail(ADMIN_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', 
                  $message, $headers);
    
    if (!$sent) {
        log_error("Email отправка не удалась", $data);
    }
    
    return $sent;
}

// ===== ОСНОВНАЯ ЛОГИКА =====

try {
    // Получаем данные
    $raw_input = file_get_contents('php://input');
    $json_data = json_decode($raw_input, true);
    $post_data = $json_data ?: $_POST;
    
    // Нормализация данных
    $data = [
        'name' => trim($post_data['name'] ?? 
                      $post_data['userName'] ?? 
                      $post_data['firstName'] ?? 
                      $post_data['username'] ?? ''),
        
        'phone' => trim($post_data['phone'] ?? 
                       $post_data['userPhone'] ?? 
                       $post_data['mobile'] ?? 
                       $post_data['telephone'] ?? 
                       $post_data['tel'] ?? ''),
        
        'email' => trim($post_data['email'] ?? 
                       $post_data['userEmail'] ?? 
                       $post_data['e-mail'] ?? 
                       $post_data['mail'] ?? ''),
        
        'form_type' => trim($post_data['form_type'] ?? 
                           $post_data['form_name'] ?? 
                           $post_data['type'] ?? 
                           $post_data['source'] ?? 'universal'),
        
        'page_url' => trim($post_data['page_url'] ?? 
                          $post_data['page'] ?? 
                          ($_SERVER['HTTP_REFERER'] ?? '')),
        
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    ];
    
    // Валидация
    if (empty($data['phone'])) {
        throw new Exception('Телефон обязателен для заполнения');
    }
    
    // Проверка на спам (простая)
    if (strlen($data['phone']) < 5) {
        throw new Exception('Некорректный номер телефона');
    }
    
    // Логируем заявку
    $log_entry = date('d.m.Y H:i:s') . "\t" .
                 $data['name'] . "\t" .
                 $data['phone'] . "\t" .
                 $data['form_type'] . "\t" .
                 $data['page_url'] . "\t" .
                 "IP:" . $data['ip'] . "\n";
    
    @file_put_contents(FORM_LOG, $log_entry, FILE_APPEND);
    
    // Отправляем уведомления
    $telegram_sent = send_telegram($data);
    $email_sent = send_email($data);
    
    // Формируем ответ
    $response = [
        'success' => true,
        'message' => 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        'details' => [
            'telegram_sent' => $telegram_sent,
            'email_sent' => $email_sent,
            'form_type' => $data['form_type'],
            'timestamp' => date('Y-m-d H:i:s')
        ],
        'version' => '2.0'
    ];
    
    // Если запрос из CLI или debug режим, добавляем отладочную информацию
    if (isset($_GET['debug']) || php_sapi_name() === 'cli') {
        $response['debug'] = [
            'received_data' => $data,
            'log_written' => true,
            'logs_location' => [
                'form_log' => FORM_LOG,
                'telegram_log' => TELEGRAM_LOG,
                'error_log' => ERROR_LOG
            ]
        ];
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Обработка ошибок
    http_response_code(400);
    
    log_error($e->getMessage(), $data ?? []);
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => 'VALIDATION_ERROR',
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
}
?>
