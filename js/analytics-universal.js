// УНИВЕРСАЛЬНАЯ ОТПРАВКА АНАЛИТИКИ ДЛЯ ВСЕХ ФОРМ
// Версия: 1.0 - Протестированная

(function() {
    'use strict';
    
    // Конфигурация
    const ANALYTICS_CONFIG = {
        yandexMetrikaId: '105466180',
        googleAnalyticsId: 'G-W9P522GECC',
        debug: true // Поставить true для тестирования
    };
    
    // Отправка в Яндекс.Метрику
    function sendYandexMetrika(eventName, params) {
        if (typeof ym !== 'undefined' && ANALYTICS_CONFIG.yandexMetrikaId) {
            try {
                ym(ANALYTICS_CONFIG.yandexMetrikaId, 'reachGoal', eventName, params || {});
                if (ANALYTICS_CONFIG.debug) console.log('✅ Яндекс.Метрика:', eventName, params);
                return true;
            } catch (e) {
                console.error('❌ Яндекс.Метрика ошибка:', e);
            }
        } else {
            if (ANALYTICS_CONFIG.debug) console.warn('⚠️ Яндекс.Метрика не загружена');
        }
        return false;
    }
    
    // Отправка в Google Analytics
    function sendGoogleAnalytics(eventName, params) {
        if (typeof gtag !== 'undefined') {
            try {
                const eventParams = {
                    event_category: 'forms',
                    event_label: params?.form_type || 'unknown',
                    value: 1,
                    ...params
                };
                
                gtag('event', eventName, eventParams);
                if (ANALYTICS_CONFIG.debug) console.log('✅ Google Analytics:', eventName, eventParams);
                return true;
            } catch (e) {
                console.error('❌ Google Analytics ошибка:', e);
            }
        } else {
            if (ANALYTICS_CONFIG.debug) console.warn('⚠️ Google Analytics не загружена');
        }
        return false;
    }
    
    // Основная функция отправки аналитики
    window.sendFormAnalytics = function(formData) {
        console.log('📊 Отправка аналитики для формы:', formData);
        
        // Яндекс.Метрика
        sendYandexMetrika('FORM_SUBMIT', {
            form_type: formData.form_type || 'unknown',
            form_name: formData.name || 'no_name',
            phone_length: formData.phone ? formData.phone.length : 0
        });
        
        // Google Analytics
        sendGoogleAnalytics('form_submit', {
            form_type: formData.form_type || 'unknown',
            form_name: formData.name || 'no_name'
        });
        
        // Для отладки
        if (ANALYTICS_CONFIG.debug) {
            console.group('📈 АНАЛИТИКА ОТПРАВЛЕНА');
            console.table(formData);
            console.groupEnd();
        }
        
        return true;
    };
    
    // Автоматическая привязка ко всем формам
    document.addEventListener('DOMContentLoaded', function() {
        // Находим ВСЕ формы на странице
        const allForms = document.querySelectorAll('form');
        
        allForms.forEach((form, index) => {
            // Пропускаем если уже есть обработчик
            if (form.hasAttribute('data-analytics-bound')) return;
            
            form.setAttribute('data-analytics-bound', 'true');
            
            form.addEventListener('submit', function(e) {
                // Собираем данные формы
                const formData = {};
                const inputs = this.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    if (input.name && input.type !== 'submit' && input.type !== 'button') {
                        formData[input.name] = input.value;
                    }
                });
                
                // Добавляем тип формы если не указан
                if (!formData.form_type) {
                    formData.form_type = this.getAttribute('data-form-type') || 
                                        this.id || 
                                        'form_' + index;
                }
                
                // Отправляем аналитику
                setTimeout(() => {
                    window.sendFormAnalytics(formData);
                }, 100); // Небольшая задержка для гарантии
            });
        });
        
        if (ANALYTICS_CONFIG.debug) {
            console.log('🔧 Аналитика привязана к', allForms.length, 'формам');
        }
    });
    
})();
