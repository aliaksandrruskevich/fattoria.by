// Добавляем обработку формы после основного скрипта
const formHandler = `
        // ========== ОБРАБОТКА ФОРМЫ ЗАЯВКИ ==========
        $(document).ready(function() {
            // Инициализация формы
            $('#newYearForm').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const form = $(this);
                
                // Проверяем валидность
                if (form[0].checkValidity() === false) {
                    form.addClass('was-validated');
                    return;
                }
                
                // Получаем данные формы
                const formData = {
                    name: $('#name').val(),
                    phone: $('#phone').val(),
                    property: $('#property').val(),
                    message: $('#message').val(),
                    form_type: 'new_year_promo',
                    source: window.location.href,
                    timestamp: new Date().toISOString()
                };
                
                console.log('📝 Отправка заявки новогодней акции:', formData);
                
                // Показываем индикатор загрузки
                const submitBtn = form.find('button[type="submit"]');
                const originalText = submitBtn.html();
                submitBtn.prop('disabled', true);
                submitBtn.html('<i class="fas fa-spinner fa-spin"></i> ОТПРАВЛЯЕМ...');
                
                // Отправляем данные на универсальный обработчик
                $.ajax({
                    url: '/universal_form_handler.php',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function(response) {
                        console.log('✅ Ответ от сервера:', response);
                        
                        if (response.success) {
                            // Показываем успешное сообщение
                            showAlert('success', '🎉 Заявка успешно отправлена!<br>Мы свяжемся с вами в течение 15 минут.');
                            
                            // Сбрасываем форму
                            form[0].reset();
                            form.removeClass('was-validated');
                            
                            // Также отправляем в Google Forms (если настроено)
                            sendToGoogleForms(formData);
                            
                        } else {
                            showAlert('danger', '❌ Ошибка при отправке: ' + (response.message || 'Попробуйте еще раз'));
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('❌ Ошибка AJAX:', error);
                        showAlert('danger', '❌ Ошибка соединения. Пожалуйста, позвоните нам по телефону.');
                    },
                    complete: function() {
                        // Восстанавливаем кнопку
                        submitBtn.prop('disabled', false);
                        submitBtn.html(originalText);
                    }
                });
            });
            
            // Валидация в реальном времени
            $('#newYearForm input, #newYearForm select').on('input change', function() {
                $(this).removeClass('is-invalid');
            });
            
            // Маска для телефона
            $('#phone').on('input', function() {
                let value = $(this).val().replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = '+375 (' + value;
                    } else if (value.length <= 5) {
                        value = '+375 (' + value.substring(0, 2) + ') ' + value.substring(2);
                    } else if (value.length <= 8) {
                        value = '+375 (' + value.substring(0, 2) + ') ' + value.substring(2, 5) + '-' + value.substring(5);
                    } else {
                        value = '+375 (' + value.substring(0, 2) + ') ' + value.substring(2, 5) + '-' + value.substring(5, 7) + '-' + value.substring(7, 9);
                    }
                }
                $(this).val(value);
            });
        });
        
        // Функция показа уведомлений
        function showAlert(type, message) {
            const alertHtml = \`
                <div class="alert alert-\${type} alert-dismissible fade show position-fixed" 
                     style="top: 20px; right: 20px; z-index: 10000; min-width: 300px;">
                    \${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            \`;
            
            $('body').append(alertHtml);
            
            // Автоматически скрываем через 5 секунд
            setTimeout(() => {
                $('.alert').alert('close');
            }, 5000);
        }
        
        // Отправка в Google Forms (если настроено)
        function sendToGoogleForms(data) {
            const googleFormsURL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
            const entries = {
                'entry.1234567890': data.name,      // Имя
                'entry.1234567891': data.phone,     // Телефон
                'entry.1234567892': data.property,  // Тип недвижимости
                'entry.1234567893': data.message,   // Сообщение
                'entry.1234567894': 'Новогодняя акция 2025-2026', // Источник
                'entry.1234567895': new Date().toLocaleString('ru-RU') // Время
            };
            
            // Формируем данные для отправки
            const formData = new FormData();
            Object.keys(entries).forEach(key => {
                formData.append(key, entries[key]);
            });
            
            // Отправляем асинхронно (не блокируя основной поток)
            fetch(googleFormsURL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).then(() => {
                console.log('✅ Данные отправлены в Google Forms');
            }).catch(err => {
                console.warn('⚠️ Не удалось отправить в Google Forms:', err);
            });
        }
        
        // Инициализация Bootstrap валидации
        (function() {
            'use strict';
            window.addEventListener('load', function() {
                const forms = document.getElementsByClassName('needs-validation');
                Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
        })();
`;

// Находим место для вставки (перед закрывающим </script>)
const fs = require('fs');
let content = fs.readFileSync('new-year-promo.html', 'utf8');

// Вставляем обработчик формы перед закрывающим тегом script
const closingScript = '</script>';
const insertPosition = content.lastIndexOf(closingScript);

if (insertPosition !== -1) {
    const before = content.substring(0, insertPosition);
    const after = content.substring(insertPosition);
    content = before + formHandler + after;
}

fs.writeFileSync('new-year-promo.html', content);
console.log('✅ Обработчик формы добавлен');
