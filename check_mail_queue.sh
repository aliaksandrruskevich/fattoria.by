#!/bin/bash

echo "=== CHECKING MAIL SYSTEM ==="

# Проверяем очередь почты
echo "1. Mail queue:"
mailq 2>/dev/null || echo "mailq command not available"

# Ищем логи почты
echo ""
echo "2. Mail logs:"
find /var/log -name "*mail*" -type f 2>/dev/null | head -10

# Проверяем настройки почты
echo ""
echo "3. Mail configuration:"
which sendmail
which mail

# Проверяем можем ли мы отправить тестовое письмо через командную строку
echo ""
echo "4. Testing command line email:"
echo "Test message from $(date)" | mail -s "Test from command line" anfattoriya@gmail.com 2>&1
echo "Command completed"

# Проверяем DNS записи для почты
echo ""
echo "5. Checking DNS records:"
dig fattoria.by MX +short
dig fattoria.by TXT +short | grep -i spf
