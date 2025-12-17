echo "=== SEO АУДИТ FATTORIA.BY ==="
echo "1. Заголовки:"
curl -s "https://fattoria.by" | grep -i -E "(<title>|<h1|<h2)" | head -5
echo -e "\n2. Мета:"
curl -s "https://fattoria.by" | grep -i -E "(description|canonical)" | head -3
echo -e "\n3. Изображения (ALT):"
curl -s "https://fattoria.by" | grep -i "alt=" | head -2 || echo "Не найдены ALT"
echo -e "\n4. Скорость:"
curl -s -o /dev/null -w "TTFB: %{time_starttransfer}с | Total: %{time_total}с\n" "https://fattoria.by"
