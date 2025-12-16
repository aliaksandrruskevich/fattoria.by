// Безопасное отслеживание отправки форм для Яндекс.Метрики и Google Analytics
(function() {
    console.log('📊 Form Analytics v2: loaded');
    
    function trackFormSubmission(form) {
        const formData = new FormData(form);
        const formType = formData.get('form_type') || form.getAttribute('data-form-type') || 'unknown_form';
        const formId = form.id || form.getAttribute('id') || 'no_id';
        
        console.log('📊 Form Analytics: отслеживаю форму', { formType, formId });
        
        // 1. Яндекс.Метрика (ID: 105466180)
        if (typeof ym !== 'undefined') {
            ym(105466180, 'reachGoal', 'form_submit', { 
                form_type: formType,
                form_id: formId,
                page: window.location.pathname 
            });
            console.log('✅ Яндекс.Метрика: событие отправлено для формы', formType);
        } else {
            console.warn('⚠️ Яндекс.Метрика не загружена');
        }
        
        // 2. Google Analytics (ID: G-C279E20DBY)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'forms',
                'event_label': formType,
                'value': 1
            });
            console.log('✅ Google Analytics: событие отправлено для формы', formType);
        } else {
            console.warn('⚠️ Google Analytics не загружена');
        }
    }
    
    // Функция для инициализации отслеживания форм
    function initFormTracking() {
        // Ждем немного чтобы все динамические формы загрузились
        setTimeout(() => {
            // Находим ВСЕ формы на странице
            const forms = document.querySelectorAll('form');
            console.log('📊 Form Analytics v2: найдено форм - ' + forms.length);
            
            if (forms.length === 0) {
                console.warn('⚠️ Form Analytics: не найдено ни одной формы!');
                console.log('Поиск по document.body.innerHTML:', document.body.innerHTML.includes('form'));
                
                // Пробуем найти формы в iframe или динамических компонентах
                const possibleForms = document.querySelectorAll('[id*="form"], [class*="form"], button[type="submit"]');
                console.log('Возможные формы/кнопки:', possibleForms.length);
            }
            
            forms.forEach((form, index) => {
                console.log(`Форма ${index + 1}:`, form.tagName, form.id || 'без id', form.className);
                
                // Отслеживаем отправку
                form.addEventListener('submit', function(event) {
                    console.log('📊 Form Analytics: форма отправляется', this.id || 'без id');
                    
                    // Не прерываем отправку
                    setTimeout(() => {
                        trackFormSubmission(this);
                    }, 100);
                });
                
                // Также отслеживаем клики на кнопки отправки
                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                submitButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        console.log('📊 Form Analytics: кнопка отправки нажата');
                    });
                });
            });
            
            // Также ищем формы которые могут быть добавлены позже
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // Element node
                                if (node.tagName === 'FORM' || node.querySelector('form')) {
                                    console.log('📊 Form Analytics: новая форма добавлена динамически');
                                    initFormTracking(); // Переинициализируем
                                }
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
        }, 1000); // Ждем 1 секунду для загрузки всех компонентов
    }
    
    // Ждем полной загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormTracking);
    } else {
        initFormTracking();
    }
    
    // Экспортируем функцию для ручного вызова если нужно
    window.reinitFormTracking = initFormTracking;
})();
