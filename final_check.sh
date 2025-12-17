#!/bin/bash
echo "=== ИТОГОВЫЙ АУДИТ FATTORIA.BY ==="
echo "1. Заголовки:"
curl -s "https://fattoria.by" | grep -i -E "(<title>|<h1)" | head -3
echo -e "\n2. Мета-теги:"
curl -s "https://fattoria.by" | grep -i -E "(canonical|description|viewport)" | head -5
echo -e "\n3. Микроразметка:"
curl -s "https://fattoria.by" | grep -i "schema.org" | head -2
echo -e "\n4. Технические параметры:"
curl -s -o /dev/null -w "Статус: %{http_code}\nTTFB: %{time_starttransfer}сек\nРазмер: %{size_download} байт\n" "https://fattoria.by"
echo -e "\n5. Рекомендации:"
echo "- Проверить адаптивность на мобильных"
echo "- Добавить фавиконку если нет"
echo "- Проверить скорость через PageSpeed Insights"
