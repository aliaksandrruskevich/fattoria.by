#!/bin/bash
echo "=== ПОЛНАЯ ДИАГНОСТИКА СИСТЕМЫ ФОРМ ==="
echo "Время: $(date '+%d.%m.%Y %H:%M:%S')"
echo ""

# 1. Проверяем файлы
echo "1. 📁 ФАЙЛОВАЯ СИСТЕМА:"
echo "----------------------"
echo "Основной обработчик (submit-form.php):"
if [ -f "api/submit-form.php" ]; then
    echo "   ✅ Существует, размер: $(wc -l < api/submit-form.php) строк"
    echo "   Первые 5 строк:"
    head -5 api/submit-form.php | awk '{print "     "$0}'
else
    echo "   ❌ НЕ СУЩЕСТВУЕТ!"
fi

echo ""
echo "Debug обработчик (submit-debug-all.php):"
if [ -f "api/submit-debug-all.php" ]; then
    echo "   ✅ Существует"
else
    echo "   ❌ НЕ СУЩЕСТВУЕТ"
fi

# 2. Проверяем логи
echo ""
echo "2. 📊 ЛОГИ:"
echo "----------"
if [ -f "form-final.log" ]; then
    echo "   form-final.log: существует"
    echo "   Последние 5 записей:"
    tail -5 form-final.log | awk '{print "     "$0}'
else
    echo "   form-final.log: ❌ НЕ СУЩЕСТВУЕТ"
fi

if [ -f "email-send.log" ]; then
    echo ""
    echo "   email-send.log: существует"
    echo "   Последние 3 отправки:"
    tail -3 email-send.log | awk '{print "     "$0}'
fi

# 3. Тестируем ОДНИМ запросом
echo ""
echo "3. 🧪 ТЕСТИРОВАНИЕ:"
echo "-----------------"
echo "Отправляю тестовый запрос..."

TEST_RESPONSE=$(curl -s -X POST "https://fattoria.by/api/submit-form.php" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Диагностика&phone=%2B375291111111&source=diagnostic_test" \
  -w "\nHTTP:%{http_code}")

HTTP_CODE=$(echo "$TEST_RESPONSE" | grep "HTTP:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$TEST_RESPONSE" | grep -v "HTTP:")

echo "   HTTP код: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Сервер отвечает"
    echo "   Ответ сервера (первые 200 символов):"
    echo "   $(echo "$RESPONSE_BODY" | head -c 200)..."
else
    echo "   ❌ Ошибка сервера"
fi

# 4. Проверяем через 2 секунды
echo ""
echo "4. ⏳ ПРОВЕРКА РЕЗУЛЬТАТОВ (через 2 секунды)..."
sleep 2

if [ -f "form-final.log" ]; then
    echo "   Последняя запись в form-final.log:"
    tail -1 form-final.log | awk '{print "     "$0}'
    
    # Проверяем сохранились ли данные
    LAST_LINE=$(tail -1 form-final.log)
    if [[ "$LAST_LINE" == *"Диагностика"* ]]; then
        echo "   ✅ Данные сохранены в лог!"
    else
        echo "   ❌ Данные НЕ сохранены в лог"
    fi
fi

echo ""
echo "=== ДИАГНОСТИКА ЗАВЕРШЕНА ==="
