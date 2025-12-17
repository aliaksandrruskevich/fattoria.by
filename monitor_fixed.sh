#!/bin/bash
TOKEN="8454954092:AAG6sBeiatuWBchCEM916I2qnSH-S82wd5U"
CHAT_ID="8138312997"
LOG_FILE="/home/fattoriaby/public_html/form-final.log"

echo "Мониторинг запущен: $(date)"
echo "Лог файл: $LOG_FILE"

# Инициализируем - читаем ВСЕ что уже есть
touch "$LOG_FILE"
LAST_LINE=$(tail -1 "$LOG_FILE")
echo "Текущая последняя строка: '$LAST_LINE'"

while true; do
    sleep 3
    
    # Проверяем новую строку
    CURRENT_LINE=$(tail -1 "$LOG_FILE")
    
    # Если файл пустой или строка та же - пропускаем
    if [ -z "$CURRENT_LINE" ] || [ "$CURRENT_LINE" = "$LAST_LINE" ]; then
        continue
    fi
    
    # Новая заявка!
    echo "[$(date)] Новая заявка: $CURRENT_LINE"
    
    # Отправляем в Telegram
    curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
      -d "chat_id=$CHAT_ID" \
      -d "text=📨 Новая заявка:%0A$CURRENT_LINE"
    
    # Обновляем
    LAST_LINE="$CURRENT_LINE"
done
