#!/bin/bash

echo "=== 🚀 ПОДГОТОВКА К GIT COMMIT ==="
echo ""

echo "1. Проверяем статус git:"
git status

echo ""
echo "2. Добавляем только нужные файлы:"
git add api/submit-form-universal-fixed-v2.php
git add api/submit-form.php
git add api/submit-test-drive.php
git add api/submit-trust-callback.php
git add api/submit-footer.php
git add api/submit-modal.php
git add api/submit-newbuilding.php
git add api/submit-project.php
git add api/submit-buyer.php
git add api/submit-seller.php
git add api/submit-form

echo "✅ Добавлены основные обработчики"

# Добавляем документацию если есть
if [ -f "api/README.md" ]; then
    git add api/README.md
    echo "✅ Добавлена документация api/README.md"
fi

if [ -f "API_STRUCTURE_FINAL.md" ]; then
    git add API_STRUCTURE_FINAL.md
    echo "✅ Добавлена документация API_STRUCTURE_FINAL.md"
fi

echo ""
echo "3. Проверяем что будет в коммите:"
git status

echo ""
echo "4. Создаем коммит:"
git commit -m "🔧 refactor: optimize forms structure and add duplicate protection

🎯 Changes:
- Centralized form processing architecture
- Added duplicate request protection (5-second lock)
- Phone number validation for all forms
- Google Sheets integration
- Email notifications
- Comprehensive logging

🏗 Architecture:
- Single main handler: submit-form-universal-fixed-v2.php
- 9+ symbolic links for different form types
- Clean and scalable structure

✅ Features:
- Duplicate protection with lock files
- Mandatory phone validation  
- Automatic Google Sheets saving
- Email notifications to anfattoriya@gmail.com
- Detailed request logging

📞 Contact: +375296380053
📧 Email: anfattoriya@gmail.com"

echo ""
echo "5. Пушим изменения:"
git push origin main

echo ""
echo "🎉 КОММИТ УСПЕШНО СОЗДАН И ОТПРАВЛЕН!"
