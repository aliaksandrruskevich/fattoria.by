#!/bin/bash
echo "=== 🔧 ПРОВЕРКА TELEGRAM БОТА ==="
BOT_TOKEN="7957641960:AAEXC319G3v_aEmPmezAM3owFwfmGMJ9190"
echo "➡️ Проверяем бот токен: $BOT_TOKEN"
curl -s "https://api.telegram.org/bot$BOT_TOKEN/getMe"
echo ""
