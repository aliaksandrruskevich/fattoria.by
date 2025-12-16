<?php
$jk_map = [
    'жк-вершина' => 'жк-вершина.html',
    'жк-депо' => 'жк-депо.html',
    'жк-дубравинский' => 'жк-дубравинский.html',
    'жк-зеленая-гавань' => 'жк-зеленая-гавань.html',
    'жк-комфорт-парк' => 'жк-комфорт-парк.html',
    'жк-левада' => 'жк-левада.html',
    'жк-маяк-минска' => 'жк-маяк-минска.html',
    'жк-минск-мир' => 'жк-минск-мир.html',
    'жк-новая-боровая' => 'жк-новая-боровая.html',
    'жк-парк-челюскинцев' => 'жк-парк-челюскинцев.html',
    'жк-фарфоровый' => 'жк-фарфоровый.html'
];

// Получаем ЖК из параметра или из URL
if (isset($_GET['jk']) && isset($jk_map[$_GET['jk']])) {
    $jk_name = $_GET['jk'];
} else {
    // Пробуем получить из URL пути
    $request = $_SERVER['REQUEST_URI'];
    $path = parse_url($request, PHP_URL_PATH);
    $jk_name = basename($path);
    
    // Убираем index.php и параметры если есть
    $jk_name = str_replace('index.php', '', $jk_name);
    $jk_name = preg_replace('/\?.*/', '', $jk_name);
    $jk_name = trim($jk_name, '/');
}

if (isset($jk_map[$jk_name])) {
    header("Location: /новостройки/{$jk_map[$jk_name]}", true, 301);
    exit;
}

// Если запрос к папке новостройки без конкретного ЖК
if (empty($jk_name) || $jk_name == 'новостройки') {
    header("Location: /new-buildings.html", true, 301);
    exit;
}

// Если не нашли - 404
header("HTTP/1.0 404 Not Found");
echo "Жилой комплекс '$jk_name' не найден";
