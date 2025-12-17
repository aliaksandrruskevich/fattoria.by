#!/bin/bash
TOKEN="8454954092:AAG6sBeiatuWBchCEM916I2qnSH-S82wd5U"
CHAT_ID1="8138312997"
CHAT_ID2="846449959"
LOG_FILE="/home/fattoriaby/public_html/form-final.log"

echo "✅ Мониторинг с КОРРЕКТНЫМ форматом логов запущен: $(date)"

# Читаем существующий лог и конвертируем в старый формат
if [ -f "$LOG_FILE" ]; then
    # Берем последнюю строку
    LAST_LINE=$(tail -1 "$LOG_FILE")
    echo "Начинаем с: $LAST_LINE"
else
    LAST_LINE=""
fi

while true; do
    sleep 2
    
    CURRENT_LINE=$(tail -1 "$LOG_FILE" 2>/dev/null)
    
    if [ -z "$CURRENT_LINE" ] || [ "$CURRENT_LINE" = "$LAST_LINE" ]; then
        continue
    fi
    
    echo "[$(date '+%H:%M:%S')] 📨 Новая заявка: $CURRENT_LINE"
    
    # 1. Отправляем в Telegram
    curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
      -d "chat_id=$CHAT_ID1" \
      -d "text=📨 Новая заявка:%0A$CURRENT_LINE" > /dev/null
    
    curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
      -d "chat_id=$CHAT_ID2" \
      -d "text=📨 Новая заявка:%0A$CURRENT_LINE" > /dev/null
    
    # 2. Записываем в form-submissions.log в СТАРОМ формате
    # Парсим строку: "08.12.2025 14:45:58 Тест 375291111111 submit-all-forms"
    TIMESTAMP=$(echo "$CURRENT_LINE" | awk '{print $1 " " $2}')
    NAME=$(echo "$CURRENT_LINE" | awk '{print $3}')
    PHONE=$(echo "$CURRENT_LINE" | awk '{print $4}')
    SOURCE=$(echo "$CURRENT_LINE" | awk '{print $5}')
    
    if [ ! -z "$NAME" ] && [ ! -z "$PHONE" ]; then
        JSON_DATA='{
            "timestamp": "'"$TIMESTAMP"'",
            "name": "'"$NAME"'",
            "phone": "'"$PHONE"'",
            "form_type": "consultation",
            "source": "'"$SOURCE"'",
            "conversion_value": 1
        }'
        
        echo "$(date '+%Y-%m-%d %H:%M:%S') | $JSON_DATA" >> /home/fattoriaby/public_html/form-submissions.log
        echo "📊 Записано в form-submissions.log"
    fi
    
    LAST_LINE="$CURRENT_LINE"
done
