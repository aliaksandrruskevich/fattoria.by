#!/bin/bash
echo "=== МОНИТОРИНГ API И ЛОГОВ ==="
echo "Нажмите Ctrl+C для выхода"
echo ""
echo "Текущие API endpoints:"
ls api/submit-*.php 2>/dev/null | xargs -n1 basename | head -10
echo ""
echo "Последние 5 записей в логе:"
tail -5 form-final.log
echo ""
echo "Ожидание новых записей через API..."
echo "Отправьте тестовую форму на сайте и следите за логами"
echo ""
tail -f form-final.log
