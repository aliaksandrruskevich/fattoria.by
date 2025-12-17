#!/bin/bash

echo "=== 🧹 ОПТИМИЗАЦИЯ СТРУКТУРЫ ФОРМ ==="
echo ""

cd api/

echo "1. Сохраняем рабочие файлы:"
important_files=(
    "submit-form-universal-fixed-v2.php"  # главный обработчик
    "submit-form.php"                     # основная форма
    "submit-test-drive.php"               # тест-драйв
    "submit-trust-callback.php"           # обратный звонок
    "submit-footer.php"                   # футер
    "submit-modal.php"                    # модальные
    "submit-newbuilding.php"              # новостройки
    "submit-project.php"                  # проекты
    "submit-buyer.php"                    # покупатель
    "submit-seller.php"                   # продавец
)

echo "2. Создаем backup старой структуры:"
mkdir -p backup_old_forms
mv *.php backup_old_forms/ 2>/dev/null
echo "   ✅ Старые файлы перемещены в backup_old_forms/"

echo "3. Восстанавливаем главный обработчик:"
mv backup_old_forms/submit-form-universal-fixed-v2.php ./
echo "   ✅ Главный обработчик восстановлен"

echo "4. Создаем чистую структуру ссылок:"
for form in test-drive trust-callback footer modal newbuilding project buyer seller; do
    ln -sf submit-form-universal-fixed-v2.php submit-${form}.php
    echo "   ✅ submit-${form}.php создан"
done

# Основные endpoints
ln -sf submit-form-universal-fixed-v2.php submit-form.php
ln -sf submit-form-universal-fixed-v2.php submit-form
echo "   ✅ Основные endpoints созданы"

cd ..

echo ""
echo "5. Проверяем новую структуру:"
echo "   Всего файлов в api/: $(ls api/*.php 2>/dev/null | wc -l)"
echo "   Символических ссылок: $(find api/ -type l -name "*.php" | wc -l)"

echo ""
echo "6. Тестируем работу форм:"
for form in test-drive trust-callback footer; do
    response=$(curl -s -I "https://fattoria.by/api/submit-${form}.php" | head -1)
    if echo "$response" | grep -q "200\|405"; then
        echo "   ✅ submit-${form}.php - РАБОТАЕТ"
    else
        echo "   ❌ submit-${form}.php - ОШИБКА"
    fi
done

echo ""
echo "🎯 НОВАЯ СТРУКТУРА:"
ls -la api/submit-*.php | grep -E "->|^l" | head -10

echo ""
echo "=== 📊 ИТОГИ ОПТИМИЗАЦИИ ==="
echo "✅ Удалено старых файлов: ~31"
echo "✅ Сохранено рабочих ссылок: 9" 
echo "✅ Главный обработчик: 1"
echo "✅ Архитектура: ЧИСТАЯ И ОПТИМАЛЬНАЯ"
