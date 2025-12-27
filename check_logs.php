<?php
/**
 * Проверка логов форм
 * Обновленная версия
 */

header('Content-Type: text/html; charset=utf-8');
echo "<!DOCTYPE html><html><head><title>Проверка логов форм</title>";
echo "<style>body{font-family:monospace;margin:20px} pre{background:#f5f5f5;padding:10px}</style>";
echo "</head><body><h2>Логи отправки форм</h2>";

$log_dir = '/home/fattoriaby/public_html/';
$logs = [
    'form-final.log' => 'Все заявки',
    'telegram-send.log' => 'Статусы Telegram',
    'form-errors.log' => 'Ошибки'
];

foreach ($logs as $file => $description) {
    $path = $log_dir . $file;
    echo "<h3>$description ($file)</h3>";
    
    if (file_exists($path)) {
        $size = filesize($path);
        $lines = file($path);
        $count = count($lines);
        
        echo "<p>Размер: " . round($size/1024, 2) . " KB, Строк: $count</p>";
        
        if ($count > 0) {
            echo "<h4>Последние 10 записей:</h4>";
            echo "<pre>";
            $recent = array_slice($lines, -10);
            foreach ($recent as $line) {
                echo htmlspecialchars($line);
            }
            echo "</pre>";
            
            // Статистика за сегодня
            $today = date('d.m.Y');
            $today_count = 0;
            foreach ($lines as $line) {
                if (strpos($line, $today) === 0) {
                    $today_count++;
                }
            }
            echo "<p>Заявок сегодня ($today): $today_count</p>";
        } else {
            echo "<p>Лог пуст</p>";
        }
    } else {
        echo "<p>Файл не найден</p>";
    }
    
    echo "<hr>";
}

// Общая статистика
echo "<h3>Общая статистика</h3>";
$form_log = $log_dir . 'form-final.log';
if (file_exists($form_log)) {
    $lines = file($form_log);
    $total = count($lines);
    
    // Подсчет по формам
    $forms = [];
    foreach ($lines as $line) {
        $parts = explode("\t", $line);
        if (count($parts) >= 4) {
            $form_type = trim($parts[3]);
            if ($form_type) {
                $forms[$form_type] = ($forms[$form_type] ?? 0) + 1;
            }
        }
    }
    
    echo "<p>Всего заявок: $total</p>";
    
    if (!empty($forms)) {
        echo "<p>Распределение по формам:</p>";
        echo "<ul>";
        arsort($forms);
        foreach ($forms as $form => $count) {
            $percent = round(($count / $total) * 100, 1);
            echo "<li>$form: $count ($percent%)</li>";
        }
        echo "</ul>";
    }
}

echo "<p><a href='check_forms.php'>← Проверить эндпоинты</a></p>";
echo "</body></html>";
?>
