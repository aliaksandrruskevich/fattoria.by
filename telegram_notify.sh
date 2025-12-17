#!/bin/bash
# Добавьте этот скрипт в cron для уведомлений о новых заявках
TOKEN="YOUR_BOT_TOKEN"
CHAT_ID="YOUR_CHAT_ID"

LAST_LINE=$(tail -1 form-final.log)
while true; do
    NEW_LINE=$(tail -1 form-final.log)
    if [ "$NEW_LINE" != "$LAST_LINE" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
            -d chat_id="$CHAT_ID" \
            -d text="📨 Новая заявка: $NEW_LINE"
        LAST_LINE="$NEW_LINE"
    fi
    sleep 30
done
