#!/bin/bash
echo "=== 📊 ВСЕ ЗАЯВКИ ИЗ ЛОГА ==="
if [ -f "form-submissions.log" ]; then
    echo "Всего заявок: $(wc -l < form-submissions.log)"
    echo ""
    # Показываем последние 10 заявок в красивом формате
    tail -10 form-submissions.log | while read line; do
        time=$(echo "$line" | cut -d'|' -f1)
        data=$(echo "$line" | cut -d'|' -f2-)
        echo "⏰ $time"
        echo "$data" | python3 -m json.tool 2>/dev/null || echo "   $data"
        echo "---"
    done
else
    echo "Лог файл не найден"
fi
