#!/bin/bash

# Создаем бэкапы всех HTML
find . -name "*.html" -exec cp {} {}.backup3 \;

# Заменяем ТОЛЬКО существующие WebP
while read img; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name_no_ext="${filename%.*}"
        webp_path="images/optimized/${name_no_ext}.webp"
        
        if [ -f "$webp_path" ]; then
            echo "Заменяем: $img -> $webp_path"
            find . -name "*.html" -exec sed -i "s|$img|$webp_path|g" {} \;
        fi
    fi
done < real_used_images2.txt

echo "=== ЗАМЕНА ЗАВЕРШЕНА ==="
