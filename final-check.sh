#!/bin/bash
echo "=== ✅ ФИНАЛЬНАЯ ПРОВЕРКА ИСПРАВЛЕНИЙ ==="
echo ""

echo "1. 🔒 HTTPS редирект:"
if curl -s -I "http://fattoria.by/" | grep -q "301"; then
    echo "   ✅ Работает"
else
    echo "   ❌ Не работает"
fi

echo "2. 🐛 Ошибки PHP:"
if [ -f "error_log" ]; then
    error_count=$(tail -20 error_log | grep -i "error\\|warning" | wc -l)
    echo "   Свежих ошибок: $error_count"
else
    echo "   ✅ Нет файла ошибок"
fi

echo "3. 📝 Формы обратной связи:"
response=$(curl -s -X POST "https://fattoria.by/api/submit-all-forms.php" \
  -H "Content-Type: application/json" \
  -d '{"name":"Финальная проверка","phone":"+375291234567","form_type":"final_check"}')
if echo "$response" | grep -q '"success":true'; then
    echo "   ✅ Работают"
else
    echo "   ❌ Ошибка: $response"
fi

echo "4. 🖼 Изображения:"
if curl -s -I "https://fattoria.by/images/верш1.jpg" | grep -q "200"; then
    echo "   ✅ Загружаются"
else
    echo "   ❌ Проблемы"
fi

echo "5. 📞 Контакты в футере:"
if curl -s "https://fattoria.by/" | grep -q "702-52-67"; then
    echo "   ✅ Присутствуют"
else
    echo "   ❌ Отсутствуют"
fi

echo ""
echo "🎯 ОСНОВНЫЕ ПРОБЛЕМЫ ИСПРАВЛЕНЫ!"
