<?php
// УНИВЕРСАЛЬНЫЙ ЗАГРУЗЧИК АНАЛИТИКИ
// Подключается во всех шаблонах перед </body>

if (!defined('ANALYTICS_LOADED')) {
    define('ANALYTICS_LOADED', true);
    
    // Проверяем существование файла
    $analytics_file = '/home/fattoriaby/public_html/js/analytics-universal.js';
    if (file_exists($analytics_file)) {
        echo '<!-- Универсальная аналитика форм -->' . PHP_EOL;
        echo '<script src="/js/analytics-universal.js" defer></script>' . PHP_EOL;
        
        // Отладочная информация только для админов
        if (isset($_GET['debug_analytics']) || (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] === 'ВАШ_IP')) {
            echo '<script>';
            echo 'console.log("📊 Аналитика форм подключена");';
            echo 'window.ANALYTICS_DEBUG = true;';
            echo '</script>';
        }
    } else {
        echo '<!-- ВНИМАНИЕ: Файл аналитики не найден! -->' . PHP_EOL;
    }
}
?>
