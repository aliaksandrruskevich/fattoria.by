#!/bin/bash

# Настройки
TOKEN="8454954092:AAG6sBeiatuWBchCEM916I2qnSH-S82wd5U"
CHAT_ID1="8138312997"     # Твой Chat ID
CHAT_ID2="846449959"      # Chat ID коллеги
LOG_FILE="/home/fattoriaby/public_html/form-final.log"

echo "✅ Мониторинг запущен: $(date)"
echo "📱 Получатели: ты ($CHAT_ID1) и коллега ($CHAT_ID2)"

# Проверяем лог файл
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Файл лога не найден: $LOG_FILE"
    exit 1
fi

# Начальная строка
LAST_LINE=$(tail -1 "$LOG_FILE")
echo "📄 Текущая последняя строка: $LAST_LINE"

# Бесконечный цикл мониторинга
while true; do
    # Ждем 3 секунды
    sleep 3
    
    # Проверяем новую строку
    CURRENT_LINE=$(tail -1 "$LOG_FILE")
    
    # Если файл пустой или строка не изменилась - пропускаем
    if [ -z "$CURRENT_LINE" ]; then
        continue
    fi
    
    if [ "$CURRENT_LINE" != "$LAST_LINE" ]; then
        echo "[$(date '+%H:%M:%S')] 📨 Новая заявка: $CURRENT_LINE"
        
        # Отправляем ТЕБЕ
        curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
          -d "chat_id=$CHAT_ID1" \
          -d "text=📨 Новая заявка:%0A$CURRENT_LINE" > /dev/null
        
        # Отправляем КОЛЛЕГЕ
        curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
          -d "chat_id=$CHAT_ID2" \
          -d "text=📨 Новая заявка:%0A$CURRENT_LINE" > /dev/null
        
        # Обновляем последнюю строку
        LAST_LINE="$CURRENT_LINE"
    fi
done
