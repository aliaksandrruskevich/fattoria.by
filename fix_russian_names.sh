#!/bin/bash

# Список русских имен которые могут быть закодированы
declare -A russian_files=(
    ["%D1%84%D0%BE%D1%82%D0%BE3"]="фото3"
    ["%D1%84%D0%BE%D1%82%D0%BE12"]="фото12"
    ["%D0%BB%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF"]="логотип"
)

for encoded in "${!russian_files[@]}"; do
    decoded="${russian_files[$encoded]}"
    echo "Исправляем: $encoded -> $decoded"
    find . -name "*.html" -exec sed -i "s|$encoded|$decoded|g" {} \;
done

echo "=== ИСПРАВЛЕНИЕ ЗАВЕРШЕНО ==="
