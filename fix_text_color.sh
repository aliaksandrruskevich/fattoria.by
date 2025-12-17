#!/bin/bash
# Исправляем цвет текста в карточках преимуществ

# 1. Находим блок с карточками и меняем цвет параграфов
sed -i '/benefit-card text-center/,/<\/div>/s/<p>/<p style="color: #333 !important;">/g' new-year-promo.html

# 2. Делаем заголовки черными
sed -i 's/<h3>/<h3 style="color: #000 !important;">/g' new-year-promo.html

# 3. Исправляем цвет в benefit-card (общий стиль)
sed -i '/\.benefit-card h3 {/,/}/s/color: #1a472a;/color: #000000 !important;/' new-year-promo.html

# 4. Добавляем стиль для параграфов в карточках
sed -i '/\.benefit-card {/a\
    color: #333 !important;' new-year-promo.html

# 5. Исправляем цвет иконок (делаем потемнее)
sed -i '/\.benefit-icon {/,/}/s/color: #1a472a;/color: #1a472a !important;/' new-year-promo.html
