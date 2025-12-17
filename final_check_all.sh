#!/bin/bash
echo "=== ПОЛНАЯ ПРОВЕРКА ВСЕХ 10 СТРАНИЦ ==="
echo ""

# Список страниц для проверки
pages=(
    "/"
    "/about"
    "/services-sellers"
    "/services-buyers"
    "/new-buildings"
    "/properties"
    "/commercial-properties"
    "/country-properties"
    "/mortgage-calculator"
    "/information"
)

echo "№ | Страница | Без .html | С .html | Контент | Размер"
echo "--|----------|-----------|---------|---------|--------"

counter=1
for page in "${pages[@]}"; do
    # Обрабатываем главную страницу
    if [ "$page" = "/" ]; then
        page_name="Главная"
        clean_url="https://fattoria.by/"
        html_url="https://fattoria.by/index.html"
    else
        page_name="${page:1}"
        clean_url="https://fattoria.by$page"
        html_url="https://fattoria.by$page.html"
    fi
    
    # Проверяем URL без .html
    status_clean=$(curl -s -o /dev/null -w "%{http_code}" "$clean_url")
    
    # Проверяем URL с .html (если не главная)
    if [ "$page" = "/" ]; then
        status_html="N/A"
    else
        status_html=$(curl -s -o /dev/null -w "%{http_code}" "$html_url")
    fi
    
    # Проверяем контент
    content_type=$(curl -s -I "$clean_url" 2>/dev/null | grep -i "content-type" | head -1 | tr -d '\r' | cut -d' ' -f2)
    
    # Проверяем размер страницы
    size=$(curl -s "$clean_url" | wc -c)
    size_kb=$((size / 1024))
    
    # Форматируем вывод
    printf "%2d | %-15s | %9s | %7s | %-8s | %d KB\n" \
        "$counter" "$page_name" "$status_clean" "$status_html" "$content_type" "$size_kb"
    
    counter=$((counter + 1))
done

echo ""
echo "=== РЕЗУЛЬТАТЫ ==="
echo "✅ Все страницы без .html должны быть 200"
echo "✅ Все страницы с .html должны быть 301 (кроме главной)"
echo "✅ Контент должен быть text/html"
