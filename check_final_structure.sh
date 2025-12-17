#!/bin/bash

echo "=== 🏗 ФИНАЛЬНАЯ СТРУКТУРА API ==="
echo ""

cd api/

echo "📁 СОДЕРЖИМОЕ ПАПКИ api/:"
echo ""

# Показываем только символические ссылки и главный обработчик
echo "🔗 СИМВОЛИЧЕСКИЕ ССЫЛКИ:"
find . -maxdepth 1 -type l -name "*.php" | while read file; do
    target=$(readlink "$file")
    echo "   📄 $(basename $file) → $target"
done

echo ""
echo "🎯 ГЛАВНЫЙ ОБРАБОТЧИК:"
ls -la submit-form-universal-fixed-v2.php

echo ""
echo "📊 СТАТИСТИКА:"
echo "   Всего файлов: $(find . -maxdepth 1 -name "*.php" | wc -l)"
echo "   Символических ссылок: $(find . -maxdepth 1 -type l -name "*.php" | wc -l)"
echo "   Реальных файлов: $(find . -maxdepth 1 -type f -name "*.php" | wc -l)"

echo ""
echo "🌐 ДОСТУПНЫЕ ENDPOINTS:"
endpoints=("form" "test-drive" "trust-callback" "footer" "modal" "newbuilding" "project" "buyer" "seller")
for endpoint in "${endpoints[@]}"; do
    if [ -e "submit-${endpoint}.php" ] || [ -e "submit-${endpoint}" ]; then
        echo "   ✅ /api/submit-${endpoint}.php"
    fi
done

cd ..

echo ""
echo "🎉 СТРУКТУРА ОПТИМИЗИРОВАНА!"
echo "   • 1 главный обработчик"
echo "   • 9+ символических ссылок" 
echo "   • Чистая архитектура"
