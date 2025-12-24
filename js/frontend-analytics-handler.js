/**
 * Универсальный обработчик форм с аналитикой
 * Используйте этот скрипт для всех форм на сайте
 */

class FormAnalyticsHandler {
    constructor() {
        this.apiEndpoint = 'https://fattoria.by/api/submit-form-universal-fixed-v2.php';
        this.init();
    }
    
    init() {
        // Находим все формы на странице
        document.addEventListener('DOMContentLoaded', () => {
            this.setupForms();
        });
    }
    
    setupForms() {
        // Находим формы по селекторам
        const formSelectors = [
            'form[action*="submit-"]',
            'form[data-form-type]',
            '.js-form-submit',
            '[data-form-handler]'
        ];
        
        formSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(form => {
                this.attachFormHandler(form);
            });
        });
    }
    
    attachFormHandler(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Добавляем аналитические параметры
            data.form_type = data.form_type || form.dataset.formType || 'universal';
            data.source = window.location.pathname;
            data.page_url = window.location.href;
            
            // Отправляем запрос
            await this.submitForm(data, form);
        });
    }
    
    async submitForm(data, formElement) {
        const submitBtn = formElement.querySelector('[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Отправка...';
        }
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Показываем успех
                this.showSuccess(formElement, '✅ Заявка отправлена!');
                
                // ВЫПОЛНЯЕМ КОД АНАЛИТИКИ ИЗ ОТВЕТА
                this.executeAnalyticsCode(result);
                
                // Сбрасываем форму
                formElement.reset();
            } else {
                this.showError(formElement, '❌ Ошибка: ' + result.message);
            }
            
        } catch (error) {
            this.showError(formElement, '❌ Ошибка сети: ' + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }
    
    executeAnalyticsCode(result) {
        // Выполняем JavaScript код для аналитики
        if (result.tracking_script) {
            const script = document.createElement('script');
            script.innerHTML = result.tracking_script;
            document.head.appendChild(script);
            console.log('📊 Код аналитики выполнен');
        }
        
        // Альтернативно: используем данные из result.analytics
        if (result.analytics) {
            // Яндекс.Метрика
            if (result.analytics.yandex_metrika && typeof ym !== 'undefined') {
                ym(result.analytics.yandex_metrika.id, 'reachGoal', 
                   result.analytics.yandex_metrika.goal,
                   result.analytics.yandex_metrika.params);
            }
            
            // Google Analytics
            if (result.analytics.google_analytics && typeof gtag !== 'undefined') {
                gtag('event', result.analytics.google_analytics.event, 
                     result.analytics.google_analytics.params);
            }
        }
    }
    
    showSuccess(formElement, message) {
        this.showMessage(formElement, message, 'success');
    }
    
    showError(formElement, message) {
        this.showMessage(formElement, message, 'error');
    }
    
    showMessage(formElement, message, type) {
        // Удаляем старые сообщения
        const oldMsg = formElement.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();
        
        // Создаем новое сообщение
        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
        msgDiv.innerHTML = message;
        msgDiv.style.cssText = `
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-weight: bold;
            ${type === 'success' ? 'background: #d4edda; color: #155724;' : 'background: #f8d7da; color: #721c24;'}
        `;
        
        formElement.appendChild(msgDiv);
        
        // Автоматически скрываем через 5 секунд
        setTimeout(() => msgDiv.remove(), 5000);
    }
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.formAnalyticsHandler = new FormAnalyticsHandler();
    console.log('✅ Обработчик форм с аналитикой загружен');
});
