#!/bin/bash

echo "=== 🔍 ПОИСК ФОРМ НА ГЛАВНОЙ СТРАНИЦЕ ==="
echo ""

echo "1. Ищем все формы и их ID:"
curl -s "https://fattoria.by/" | grep -i -E 'form|modal|popup' | grep -o 'id="[^"]*"' | sort | uniq

echo ""
echo "2. Ищем JavaScript обработчики:"
curl -s "https://fattoria.by/" | grep -i -E 'test.*drive|trust.*callback|feedback|contact' | head -10

echo ""
echo "3. Проверяем CSS классы форм:"
curl -s "https://fattoria.by/" | grep -o 'class="[^"]*form[^"]*"' | sort | uniq

echo ""
echo "=== 🎯 РЕКОМЕНДАЦИИ ==="
echo "Если формы на главной не найдены, возможно:"
echo "• Формы загружаются через JavaScript"
echo "• Используются модальные окна"
echo "• ID форм отличаются от ожидаемых"
