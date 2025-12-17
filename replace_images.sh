#!/bin/bash

# Функция для замены PNG/JPG на WebP
replace_images() {
    local html_file=$1
    
    # Создаем backup
    cp "$html_file" "${html_file}.backup"
    
    # Заменяем все .png на .webp
    sed -i 's/\.png"/\.webp"/g' "$html_file"
    sed -i "s/\.png'/\.webp'/g" "$html_file"
    sed -i 's/\.png>/\.webp>/g' "$html_file"
    
    # Заменяем все .jpg на .webp  
    sed -i 's/\.jpg"/\.webp"/g' "$html_file"
    sed -i 's/\.jpeg"/\.webp"/g' "$html_file"
    
    echo "Обновлен: $html_file"
}

# Находим все HTML файлы и применяем замену
find . -name "*.html" -type f | while read file; do
    replace_images "$file"
done

echo "=== ЗАМЕНА ЗАВЕРШЕНА ==="
