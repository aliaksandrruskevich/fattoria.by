#!/bin/bash
echo "=== ИСПРАВЛЕНИЕ HTML ОШИБОК ==="

# 1. Копируем бэкап
cp index.html index.html.backup_$(date +%Y%m%d_%H%M%S)

# 2. Исправляем canonical
sed -i 's|href="https://fattoria.by/" />|href="https://fattoria.by">|' index.html

# 3. Убираем type="text/javascript"
sed -i 's|type="text/javascript"||g' index.html

# 4. Ищем лишние теги
echo "Ищу лишние теги script..."
grep -n "</script></script>" index.html && echo "Найдены дубли!" || echo "Дублей нет"

# 5. Проверяем
echo ""
echo "✅ Исправления применены"
echo "Проверь: https://validator.w3.org/nu/?doc=https://fattoria.by"
