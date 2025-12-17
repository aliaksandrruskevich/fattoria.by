#!/bin/bash
# Мониторинг лога заявок и отправка в Telegram

TOKEN="8454954092:AAG6sBeiatuWBchCEM916I2qnSH-S82wd5U"
CHAT_ID="8138312997"
LOG_FILE="/home/fattoriaby/public_html/form-final.log"

echo "Мониторинг запущен $(date)"

# Проверяем существование лога
if [ ! -f "$LOG_FILE" ]; then
    echo "Лог файл не найден: $LOG_FILE"
    exit 1
fi

# Получаем последнюю строку
LAST_LINE=$(tail -1 "$LOG_FILE")

while true; do
    # Ждем 10 секунд
    sleep 10
    
    # Текущая последняя строка
    CURRENT_LINE=$(tail -1 "$LOG_FILE")
    
    # Если есть изменения
    if [ "$CURRENT_LINE" != "$LAST_LINE" ] && [ ! -z "$CURRENT_LINE" ]; then
        echo "Новая заявка: $CURRENT_LINE"
        
        # Отправляем в Telegram
        curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
          -d "chat_id=$CHAT_ID" \
          -d "text=📨 Новая заявка:%0A$CURRENT_LINE"
        
        # Обновляем
        LAST_LINE="$CURRENT_LINE"
    fi
done
