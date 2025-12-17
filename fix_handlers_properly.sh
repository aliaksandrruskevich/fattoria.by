#!/bin/bash
echo "=== ИСПРАВЛЕНИЕ ОБРАБОТЧИКОВ (СОХРАНЯЯ ЛОГИКУ) ==="

# Функция для добавления универсального парсинга
add_universal_parsing() {
    local file=$1
    
    # Создаем backup
    cp "$file" "${file}.backup.before_fix"
    
    # Создаем исправленную версию
    cat > "$file" << 'PHP'
<?php
// УНИВЕРСАЛЬНЫЙ ПАРСИНГ ДАННЫХ (добавлено автоматически)
if (!empty($_POST)) {
    $data = $_POST;
} else {
    $input = file_get_contents('php://input');
    $content_type = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($content_type, 'application/json') !== false) {
        $data = json_decode($input, true) ?: [];
    } else {
        parse_str($input, $data);
    }
}

// Сохраняем оригинальную логику обработчика
PHP
    
    # Добавляем оригинальный код без первых <?php строк
    tail -n +2 "${file}.backup.before_fix" | sed '/^$/d' >> "$file"
    
    echo "✅ Исправлен: $(basename $file)"
}

# Исправляем все обработчики кроме основного
for file in api/submit-*.php; do
    if [[ "$(basename $file)" != "submit-form.php" ]] && \
       [[ "$(basename $file)" != "submit-form-debug.php" ]] && \
       [[ "$(basename $file)" != "submit-form-perfect.php" ]]; then
        add_universal_parsing "$file"
    fi
done

echo ""
echo "=== ВСЕ ОБРАБОТЧИКИ ИСПРАВЛЕНЫ ==="
