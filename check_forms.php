<?php
echo "<h2>Проверка работы форм на fattoria.by</h2>";

// Проверка логов
echo "<h3>Логи email отправки:</h3>";
if (file_exists('../email-send.log')) {
    $email_logs = file('../email-send.log');
    echo "<pre>";
    echo "Всего записей: " . count($email_logs) . "\n\n";
    echo "Последние 5 записей:\n";
    echo implode("", array_slice($email_logs, -5));
    echo "</pre>";
} else {
    echo "<p style='color: red;'>Файл email-send.log не найден!</p>";
}

echo "<h3>Логи Google Sheets:</h3>";
if (file_exists('../google-send.log')) {
    $google_logs = file('../google-send.log');
    $success_count = 0;
    $error_count = 0;
    
    foreach ($google_logs as $line) {
        if (strpos($line, '"success"') !== false) {
            $success_count++;
        } else {
            $error_count++;
        }
    }
    
    echo "<p>Успешных отправок: <strong>$success_count</strong></p>";
    echo "<p>Ошибок: <strong>$error_count</strong></p>";
    echo "<p>Всего записей: <strong>" . count($google_logs) . "</strong></p>";
}

echo "<h3>Логи форм (form-final.log):</h3>";
if (file_exists('../form-final.log')) {
    $form_logs = file('../form-final.log');
    echo "<p>Всего заявок: <strong>" . count($form_logs) . "</strong></p>";
    
    // Последние заявки
    echo "<h4>Последние 3 заявки:</h4>";
    echo "<pre>";
    echo implode("", array_slice($form_logs, -3));
    echo "</pre>";
}

echo "<h3>Тест отправки email:</h3>";
echo '<form method="post">
    <input type="hidden" name="test_email" value="1">
    <button type="submit">Отправить тестовый email</button>
</form>';

if (isset($_POST['test_email'])) {
    $to = 'anfattoriya@gmail.com';
    $subject = 'Тест из панели проверки: ' . date('d.m.Y H:i:s');
    $message = 'Тестовое сообщение из панели проверки работы форм.';
    $headers = "From: noreply@fattoria.by\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        echo "<p style='color: green;'>✅ Тестовый email отправлен на $to</p>";
    } else {
        echo "<p style='color: red;'>❌ Ошибка отправки тестового email</p>";
    }
}
?>
