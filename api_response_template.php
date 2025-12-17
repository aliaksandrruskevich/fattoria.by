<?php
// ЕДИНЫЙ ФОРМАТ ОТВЕТА ДЛЯ ВСЕХ API
function send_json_response($data = [], $success = true, $custom_message = null) {
    $default_message = $success 
        ? 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
        : 'Произошла ошибка при отправке заявки.';
    
    $response = [
        'success' => $success,
        'message' => $custom_message ?: $default_message,
        'timestamp' => date('d.m.Y H:i:s'),
        'data' => $data
    ];
    
    header('Content-Type: application/json');
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
?>
