<?php
/**
 * Проверка работоспособности всех обработчиков форм
 * Обновленная версия для новых эндпоинтов
 */

header('Content-Type: text/html; charset=utf-8');
echo "<!DOCTYPE html><html><head><title>Проверка форм</title>";
echo "<style>body{font-family:monospace;margin:20px} .ok{color:green} .error{color:red} table{border-collapse:collapse} td,th{border:1px solid #ccc;padding:5px}</style>";
echo "</head><body><h2>Проверка обработчиков форм fattoria.by</h2>";
echo "<p>Время проверки: " . date('d.m.Y H:i:s') . "</p>";

// Функция для тестирования эндпоинта
function test_endpoint($name, $url, $data) {
    echo "<tr><td>$name</td><td>$url</td>";
    
    $start = microtime(true);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $time = round((microtime(true) - $start) * 1000, 1);
    
    if ($http_code == 200) {
        $json = json_decode($response, true);
        if ($json && isset($json['success'])) {
            $telegram = isset($json['telegram_sent']) ? $json['telegram_sent'] : 
                       (isset($json['details']['telegram_sent']) ? $json['details']['telegram_sent'] : null);
            $email = isset($json['email_sent']) ? $json['email_sent'] :
                    (isset($json['details']['email_sent']) ? $json['details']['email_sent'] : null);
            
            echo "<td class='ok'>✅ Успех</td>";
            echo "<td>{$time}мс</td>";
            echo "<td>" . ($telegram === true ? '✅' : ($telegram === false ? '❌' : '—')) . "</td>";
            echo "<td>" . ($email === true ? '✅' : ($email === false ? '❌' : '—')) . "</td>";
            echo "<td>" . htmlspecialchars(substr($response, 0, 100)) . "...</td>";
        } else {
            echo "<td class='error'>❌ Невалидный JSON</td>";
            echo "<td>{$time}мс</td><td>—</td><td>—</td>";
            echo "<td>" . htmlspecialchars(substr($response, 0, 100)) . "...</td>";
        }
    } else {
        echo "<td class='error'>❌ HTTP $http_code</td>";
        echo "<td>{$time}мс</td><td>—</td><td>—</td>";
        echo "<td>" . htmlspecialchars($error) . "</td>";
    }
    
    echo "</tr>";
}

// Тестовые данные
$test_data = [
    'name' => 'Тест проверки',
    'phone' => '+37529111' . rand(1000, 9999),
    'email' => 'test@example.com',
    'form_type' => 'health_check',
    'page_url' => 'https://fattoria.by/check_forms.php'
];

echo "<table><tr><th>Эндпоинт</th><th>URL</th><th>Статус</th><th>Время</th><th>Telegram</th><th>Email</th><th>Ответ</th></tr>";

// Тестируем все эндпоинты
$endpoints = [
    ['Основной (универсальный)', '/api/submit-form-universal.php'],
    ['V2 совместимый', '/api/submit-form-universal-fixed-v2.php'],
    ['V3 совместимый', '/api/submit-form-universal-fixed-v3.php'],
    ['Финальный', '/api/submit-form-universal-fixed-final.php'],
    ['Мастер', '/api/submit-form.php'],
    ['Старый universal-final', '/api/submit-form-universal-final.php']
];

foreach ($endpoints as $endpoint) {
    test_endpoint($endpoint[0], 'https://fattoria.by' . $endpoint[1], $test_data);
}

echo "</table>";

// Проверка логов
echo "<h3>Статус логов:</h3>";
echo "<ul>";
$logs = [
    'form-final.log' => '/home/fattoriaby/public_html/form-final.log',
    'telegram-send.log' => '/home/fattoriaby/public_html/telegram-send.log',
    'form-errors.log' => '/home/fattoriaby/public_html/form-errors.log'
];

foreach ($logs as $name => $path) {
    if (file_exists($path)) {
        $size = filesize($path);
        $lines = count(file($path));
        $modified = date('d.m.Y H:i:s', filemtime($path));
        echo "<li>$name: {$lines} строк, " . round($size/1024, 2) . " KB, изменен: $modified</li>";
    } else {
        echo "<li>$name: ❌ не найден</li>";
    }
}
echo "</ul>";

// Последние заявки
echo "<h3>Последние 5 заявок:</h3>";
if (file_exists($logs['form-final.log'])) {
    $lines = file($logs['form-final.log']);
    $recent = array_slice($lines, -5);
    echo "<pre>";
    foreach ($recent as $line) {
        echo htmlspecialchars($line);
    }
    echo "</pre>";
}

echo "</body></html>";
?>
