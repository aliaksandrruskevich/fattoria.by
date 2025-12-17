#!/bin/bash

echo "=== CHECKING TELEGRAM BOT SETUP ==="
echo ""

# Проверяем что бот доступен
BOT_TOKEN="7957641960:AAEXC319G3v_aEmPmezAM3owFwfmGMJ9190"

echo "1. Testing bot access..."
response=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe")

if echo "$response" | grep -q '"ok":true'; then
    echo "✅ Bot is accessible and working"
    bot_name=$(echo "$response" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    echo "🤖 Bot username: @$bot_name"
else
    echo "❌ Bot is not accessible"
    echo "Response: $response"
fi

echo ""
echo "2. Important: Add bot to channel @fattoriaminsk"
echo "   - Go to @fattoriaminsk channel"
echo "   - Add @FattoriaByBot as admin"
echo "   - Give permission to send messages"
echo ""
echo "3. Alternative: Use personal chat ID"
echo "   - Send message to @FattoriaByBot"
echo "   - Check telegram-final.log for your chat ID"
echo "   - Replace '@fattoriaminsk' with your chat ID in code"
