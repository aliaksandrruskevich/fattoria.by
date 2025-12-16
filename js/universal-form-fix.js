// УНИВЕРСАЛЬНЫЙ ФИКС ДЛЯ ВСЕХ ФОРМ
console.log('🔧 Универсальный фикс форм загружен');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🎯 Поиск всех форм на странице...');
        
        // Находим ВСЕ формы
        const allForms = document.querySelectorAll('form');
        console.log('📋 Найдено форм:', allForms.length);
        
        allForms.forEach((form, index) => {
            console.log(`   Форма ${index}:`, form.id || 'без ID');
            
            // Удаляем старые обработчики и добавляем наш
            form.onsubmit = null;
            form.addEventListener('submit', function(e) {
                if (this.id === "consultForm") return;
                e.preventDefault();
                console.log('🚀 Отправка формы:', this.id || 'без ID');
                
                // Собираем все данные формы
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // ✅ АККУРАТНО ДОБАВЛЯЕМ YANDEX CLIENT ID (без поломки)
                const originalSendForm = function(formData) {
                    // Определяем тип формы
                    let endpoint = '/api/submit-all-forms.php';
                    let formType = 'general';

                    if (this.id === 'modalContactForm' || this.id === 'projectContactForm') {
                        endpoint = '/api/submit-newbuilding.php';
                        formType = 'newbuilding';
                    } else if (this.id === 'contactForm' || window.location.pathname.includes('новостройки')) {
                        endpoint = '/api/submit-project.php';
                        formType = 'project';
                    } else if (this.id === 'testDriveForm') {
                        endpoint = '/api/submit-test-drive.php';
                        formType = 'test-drive';
                    } else if (this.id === 'trustCallbackForm') {
                        endpoint = '/api/submit-trust-callback.php';
                        formType = 'trust-callback';
                    } else if (this.id === 'feedbackFormBottom') {
                        // Обработка для feedbackFormBottom
                    } else if (this.id === 'buyerForm' || this.id === 'sellerForm') {
                        endpoint = '/api/submit-newbuilding.php';
                        formType = 'consultation';
                    }

                    // Добавляем системные данные
                    formData.form_type = formType;
                    formData.source = window.location.href;
                    formData.page_title = document.title;

                    console.log('📤 Отправка на', endpoint, ':', formData);

                    // Отправляем на API
                    fetch(endpoint, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(formData)
                    })
                    .then(r => r.json())
                    .then(result => {
                        console.log('✅ Ответ:', result);
                        alert('✅ ' + result.message);
                        if (result.success || result.message) {
                            this.reset();
                            // Закрываем модальное окно если есть
                            const modal = this.closest('.modal');
                            if (modal) {
                                const bsModal = bootstrap.Modal.getInstance(modal);
                                if (bsModal) bsModal.hide();
                            }
                        }
                    })
                    .catch(err => {
                        console.error('❌ Ошибка:', err);
                        alert('❌ Ошибка отправки. Позвоните: +375296380053');
                    });
                };

                // Получаем Yandex ClientID если доступен
                if (typeof ym === 'function') {
                    try {
                        ym(105466180, 'getClientID', function(clientId) {
                            data.yandex_client_id = clientId || 'not_available';
                            console.log('🎯 Yandex ClientID:', data.yandex_client_id);
                            originalSendForm.call(this, data);
                        }.bind(this));
                    } catch (error) {
                        console.log('⚠️ Ошибка ClientID:', error);
                        data.yandex_client_id = 'error';
                        originalSendForm.call(this, data);
                    }
                } else {
                    console.log('⚠️ Яндекс.Метрика не загружена');
                    data.yandex_client_id = 'metrika_not_loaded';
                    originalSendForm.call(this, data);
                }
            });
        });
        
        console.log('✅ Универсальный фикс применен к', allForms.length, 'формам');
    }, 1000);
});
// Лог всех отправок форм
