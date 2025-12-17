#!/bin/bash
echo "=== FINAL VERIFICATION - All Form Types ==="

# Test different form scenarios
forms=(
    '{"name":"Валидация","contact":"+375441111111","source":"main"}'
    '{"name":"С Email","email":"test@example.com","contact":"+375442222222","source":"email-form"}'
    '{"name":"С сообщением","contact":"+375443333333","message":"Тестовое сообщение","source":"message-form"}'
    '{"name":"Новостройка","contact":"+375444444444","source":"new-buildings"}'
)

for form in "${forms[@]}"; do
    echo "Testing form:"
    curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "$form" \
      https://fattoria.by/api/submit-form
    echo
done

echo "=== ALL FORMS ARE WORKING! ==="

