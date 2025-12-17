#!/bin/bash
echo "=== 🔍 ГЛУБОКИЙ АУДИТ САЙТА НА БАГИ И УЛУЧШЕНИЯ ==="
echo ""

# 1. ПРОВЕРКА ОШИБОК JavaScript
echo "1. 🔧 ОШИБКИ JAVASCRIPT:"
echo "-----------------------"
# Проверим основные JS файлы на ошибки
js_files=("js/forms.js" "js/forms-handler.js" "js/beautiful-consult-modal.js" "js/instant-form-submit.js")
for js_file in "${js_files[@]}"; do
    if [ -f "$js_file" ]; then
        echo -n "   $js_file: "
        # Проверяем базовый синтаксис
        if node -c "$js_file" 2>/dev/null; then
            echo "✅ OK"
        else
            echo "❌ Есть ошибки"
            # Покажем первые ошибки
            node -c "$js_file" 2>&1 | head -3
        fi
    fi
done

# 2. ПРОВЕРКА CSS ОШИБОК
echo ""
echo "2. 🎨 ПРОВЕРКА CSS:"
echo "------------------"
css_files=("css/main.css" "css/novostroyki.css")
for css_file in "${css_files[@]}"; do
    if [ -f "$css_file" ]; then
        echo -n "   $css_file: "
        # Простая проверка на наличие ошибок
        if grep -q "undefined\|null\|NaN" "$css_file"; then
            echo "⚠️ Возможные проблемы"
        else
            echo "✅ OK"
        fi
    fi
done

# 3. ПРОВЕРКА БИТЫХ ССЫЛОК
echo ""
echo "3. 🔗 ПРОВЕРКА БИТЫХ ССЫЛОК:"
echo "---------------------------"
pages=("" "new-buildings" "services-buyers" "services-sellers" "contacts")
for page in "${pages[@]}"; do
    echo -n "   $page: "
    broken_links=$(curl -s "https://fattoria.by/$page" | grep -o 'href="[^"]*"' | grep -E "(404|error|undefined)" | wc -l)
    if [ "$broken_links" -gt 0 ]; then
        echo "❌ $broken_links проблемных ссылок"
    else
        echo "✅ OK"
    fi
done

# 4. ПРОВЕРКА ИЗОБРАЖЕНИЙ
echo ""
echo "4. 🖼 ПРОВЕРКА ИЗОБРАЖЕНИЙ:"
echo "--------------------------"
# Проверим основные изображения
if curl -s -I "https://fattoria.by/images/logo.png" | grep -q "200"; then
    echo "   ✅ Логотип загружается"
else
    echo "   ❌ Проблемы с логотипом"
fi

# 5. ПРОВЕРКА ФОРМ НА РАЗНЫХ СТРАНИЦАХ
echo ""
echo "5. 📝 ТЕСТ ФОРМ НА ВСЕХ СТРАНИЦАХ:"
echo "----------------------------------"
form_pages=("new-buildings" "services-buyers" "services-sellers")
for page in "${form_pages[@]}"; do
    echo -n "   $page: "
    # Проверяем есть ли формы на странице
    forms_count=$(curl -s "https://fattoria.by/$page" | grep -c "form.*id=")
    if [ "$forms_count" -gt 0 ]; then
        # Тестируем отправку
        response=$(curl -s -X POST "https://fattoria.by/api/submit-all-forms.php" \
            -H "Content-Type: application/json" \
            -d "{\"name\":\"Тест $page\",\"phone\":\"+37529$(date +%S)1111\",\"form_type\":\"$page\"}")
        if echo "$response" | grep -q '"success":true'; then
            echo "✅ Форма работает"
        else
            echo "❌ Ошибка формы"
        fi
    else
        echo "⚠️ Нет форм"
    fi
done

# 6. ПРОВЕРКА КОНСОЛЬНЫХ ОШИБОК
echo ""
echo "6. ⚠️ ПРОВЕРКА ОШИБОК В КОНСОЛИ:"
echo "------------------------------"
# Эмулируем браузерные проверки
echo "   Запустите в браузере для проверки:"
echo "   - F12 → Console → посмотреть ошибки"
echo "   - F12 → Network → проверить загрузку ресурсов"

# 7. ПРОВЕРКА ОТЗЫВЧИВОСТИ
echo ""
echo "7. 📱 ТЕСТ ОТЗЫВЧИВОСТИ:"
echo "-----------------------"
echo "   Проверить на разных устройствах:"
echo "   - Mobile (320px-768px)"
echo "   - Tablet (768px-1024px)" 
echo "   - Desktop (1024px+)"

# 8. ПРОВЕРКА SEO
echo ""
echo "8. 🔍 SEO АУДИТ:"
echo "---------------"
echo "   Проверить:"
echo "   - Title на всех страницах"
echo "   - Meta descriptions"
echo "   - H1 заголовки"
echo "   - Alt тексты изображений"

# 9. ПРОВЕРКА СКОРОСТИ
echo ""
echo "9. ⚡ ДЕТАЛЬНАЯ ПРОВЕРКА СКОРОСТИ:"
echo "--------------------------------"
echo "   Инструменты для проверки:"
echo "   - Google PageSpeed Insights"
echo "   - GTmetrix"
echo "   - Pingdom"

# 10. БЕЗОПАСНОСТЬ
echo ""
echo "10. 🔒 ПРОВЕРКА БЕЗОПАСНОСТИ:"
echo "---------------------------"
echo "   Проверить:"
echo "   - HTTPS редирект"
echo "   - Защита от XSS"
echo "   - Валидация данных форм"

echo ""
echo "=== 🎯 ЧТО НУЖНО УЛУЧШИТЬ ==="
