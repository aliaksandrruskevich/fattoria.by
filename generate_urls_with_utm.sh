#!/bin/bash
# Генерация URL с UTM-метками

UTM_SOURCE="yandex"
UTM_MEDIUM="cpc"
UTM_CAMPAIGN="fattoria_realty"
UTM_CONTENT_PREFIX="ad"

echo "=== URL С UTM-МЕТКАМИ ДЛЯ ЯНДЕКС.ДИРЕКТ ==="
echo ""

pages="about services-sellers new-buildings properties"

for i in $pages; do
    # Генерируем случайный ID для объявления
    AD_ID=$((10000 + RANDOM % 90000))
    
    # Создаем URL с UTM
    URL="https://fattoria.by/$i?utm_source=$UTM_SOURCE&utm_medium=$UTM_MEDIUM&utm_campaign=$UTM_CAMPAIGN&utm_content=${UTM_CONTENT_PREFIX}${AD_ID}"
    
    echo "$URL"
done

echo ""
echo "=== КОРОТКИЕ URL БЕЗ UTM (если Яндекс требует) ==="
for i in $pages; do
    echo "https://fattoria.by/$i"
done
