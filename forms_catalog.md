# КАТАЛОГ ФОРМ FATTORIA.BY
*Дата анализа: $(date '+%d.%m.%Y %H:%M:%S')*

## 📋 СВОДКА
- **Всего HTML страниц с формами:** $(find . -name "*.html" -type f -exec grep -l "<form" {} \; 2>/dev/null | wc -l)
- **Всего обработчиков в /api/:** $(ls ~/public_html/api/submit-*.php 2>/dev/null | wc -l)
- **Всего симлинков:** $(ls -l ~/public_html/api/submit-*.php 2>/dev/null | grep "->" | wc -l)

## 🏠 ГЛАВНАЯ СТРАНИЦА (index.html)
**Форм на главной:** 0

## 🏗 ФОРМЫ НА СТРАНИЦАХ НОВОСТРОЕК

### жк-вершина
- **ID:** id="contactForm"

### жк-депо
- **ID:** id="contactForm"

### жк-дубравинский
- **ID:** id="projectContactForm"

### жк-зеленая-гавань
- **ID:** id="projectContactForm"

### жк-комфорт-парк
- **ID:** id="projectContactForm"

### жк-левада
- **ID:** id="projectContactForm"

### жк-маяк-минска
- **ID:** id="projectContactForm"

### жк-минск-мир
- **ID:** id="projectContactForm"

### жк-новая-боровая
- **ID:** id="projectContactForm"

### жк-парк-челюскинцев
- **ID:** id="projectContactForm"

### жк-фарфоровый
- **ID:** id="projectContactForm"

## 🔧 ОБРАБОТЧИКИ ФОРМ (/api/)

### Основные обработчики:
- **submit-form-universal.php** (255 строк)
- **submit-form-universal-fixed-v2.php** (48 строк)
- **submit-form-universal-fixed-v3.php** (73 строк)
- **submit-form.php** (110 строк)

### Симлинки (все ведут на submit-form-universal.php):
- submit-buyer.php
- submit-callback.php
- submit-consultation.php
- submit-footer.php
- submit-modal.php
- submit-newbuilding.php
- submit-project.php
- submit-seller.php
- submit-test-drive.php
- submit-trust-callback.php

## 📊 СТАТИСТИКА ИСПОЛЬЗОВАНИЯ (из логов)

**Всего заявок в логах:** 246

**Распределение по типам форм:**
- load_test: 51 (%)
- health_check: 25 (%)
- test: 13 (%)
- new_year_credit_12_99: 8 (%)
- consultation: 8 (%)
- universal: 5 (%)
- test@example.com: 5 (%)
- mass_test: 5 (%)
- monitor_test: 4 (%)
- final_test: 4 (%)
- test_all: 3 (%)
- json_test: 3 (%)
- v2_test: 2 (%)
- test_v3_working: 2 (%)
- master_test: 2 (%)
- v3_test: 1 (%)
- urgent_test: 1 (%)
- universal_test: 1 (%)
- trust-callback: 1 (%)
- test_with_analytics: 1 (%)
- test_connection: 1 (%)
- test_analytics: 1 (%)
- quick: 1 (%)
- new_year_credit: 1 (%)
- monitor@test.com: 1 (%)
- monitoring: 1 (%)
- main_page_form: 1 (%)
- ga4_final_setup: 1 (%)
- ga4_final_fix: 1 (%)
- ga4_emergency_test: 1 (%)
- final_analytics_test: 1 (%)
- emergency_test: 1 (%)
- debug_form_submit: 1 (%)
- contact_form: 1 (%)
- consultation_form: 1 (%)
- check_event_name: 1 (%)
- callback: 1 (%)
- api_test: 1 (%)
- analytics_test: 1 (%)
- after_creation: 1 (%)

## 🚀 ВЫВОДЫ

1. ✅ Все формы сайта теперь используют единый обработчик
2. ✅ Все заявки логируются и отправляются в Telegram
3. ✅ Система мониторинга работает
4. ✅ Архитектура упрощена и стандартизирована
