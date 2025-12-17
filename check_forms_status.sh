#!/bin/bash

echo "=== 🔍 ДИАГНОСТИКА ФОРМ ==="
echo ""

echo "1. Проверяем символические ссылки:"
for form in test-drive trust-callback footer modal newbuilding project buyer seller; do
    if [ -L "api/submit-${form}.php" ]; then
        target=$(readlink "api/submit-${form}.php")
        echo "   ✅ submit-${form}.php → $target"
    else
        echo "   ❌ submit-${form}.php - НЕ ССЫЛКА!"
    fi
done

echo ""
echo "2. Проверяем главный обработчик:"
if [ -f "api/submit-form-universal-fixed-v2.php" ]; then
    echo "   ✅ Главный обработчик существует"
    ls -la api/submit-form-universal-fixed-v2.php
else
    echo "   ❌ Главный обработчик отсутствует!"
fi

echo ""
echo "3. Тестируем API напрямую:"
response=$(curl -s -X POST "https://fattoria.by/api/submit-form-universal-fixed-v2.php" \
  -H "Content-Type: application/json" \
  -d '{"name":"Диагностика","phone":"+375291234567","form_type":"test"}')
echo "   Ответ: $response"

echo ""
echo "4. Проверяем логи:"
tail -5 form-final.log 2>/dev/null || echo "   Логи не найдены"
