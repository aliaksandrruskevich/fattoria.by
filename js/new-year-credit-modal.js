// ========== НОВОГОДНЯЯ ФОРМА КРЕДИТА 12.99% ==========
console.log('🎅 Загружаем новогоднюю форму кредита...');

// Ждем 4 секунды после загрузки страницы
setTimeout(function() {
    console.log('✨ Открываем форму кредита 12.99%...');
    
    // Создаем новогоднее модальное окно
    const newYearModalHTML = `
    <div class="modal fade" id="newYearCreditModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="
                background: linear-gradient(135deg, #0d2818 0%, #1a472a 100%);
                border: 5px solid #ffd700;
                border-radius: 20px;
                color: white;
            ">
                <div class="modal-header" style="
                    border-bottom: 3px solid #ffd700;
                    background: rgba(26, 71, 42, 0.9);
                    border-radius: 15px 15px 0 0;
                ">
                    <h3 class="modal-title w-100 text-center" style="color: #ffd700;">
                        🎄 НОВОГОДНЯЯ АКЦИЯ 2025-2026 🎄
                    </h3>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <div class="row align-items-center">
                        <div class="col-md-6 text-center">
                            <div style="
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 15px;
                                padding: 20px;
                                border: 2px solid #ffd700;
                                margin-bottom: 20px;
                            ">
                                <h1 style="color: #ffd700; font-size: 3.5rem; font-weight: bold;">
                                    12.99%
                                </h1>
                                <p style="font-size: 1.2rem; margin-bottom: 5px;">кредит на новостройку</p>
                                <p style="color: #ffd700;">Действует до 14 января 2026</p>
                            </div>
                            <div style="margin-top: 20px;">
                                <p>🎁 <strong>Новогодние преимущества:</strong></p>
                                <ul style="text-align: left; padding-left: 20px;">
                                    <li>Покупая через нас - получи кредит под 12.99%</li>
                                    <li>Юридическое сопровождение сделки</li>
                                    <li>Подарок при оформлении до 31.12.2025</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4 class="text-center mb-4" style="color: #ffd700;">
                                🎯 Оставьте заявку
                            </h4>
                            <form id="newYearCreditForm">
                                <input type="hidden" name="form_type" value="new_year_credit_12_99">
                                <input type="hidden" name="source" value="Всплывающая форма 12.99%">
                                
                                <div class="mb-3">
                                    <label class="form-label" style="color: #ffd700;">Ваше имя *</label>
                                    <input type="text" class="form-control" name="name" 
                                           placeholder="Иван Иванов" required
                                           style="background: white; color: #000; border: 2px solid #ffd700;">
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label" style="color: #ffd700;">Телефон *</label>
                                    <input type="tel" class="form-control" name="phone" 
                                           placeholder="+375 (29) XXX-XX-XX" required
                                           style="background: white; color: #000; border: 2px solid #ffd700;">
                                </div>
                                
                                <button type="submit" class="btn w-100" style="
                                    background: linear-gradient(45deg, #ffd700, #ff9500);
                                    color: #1a472a;
                                    font-weight: bold;
                                    padding: 15px;
                                    border-radius: 10px;
                                    border: 3px solid white;
                                    font-size: 1.1rem;
                                ">
                                    🎁 ПОЛУЧИТЬ КРЕДИТ 12.99%
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Добавляем модальное окно на страницу
    document.body.insertAdjacentHTML('beforeend', newYearModalHTML);
    
    // Открываем через 500ms
    setTimeout(function() {
        const modalElement = document.getElementById('newYearCreditModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Новогодняя форма кредита открыта!');
            
            // Настраиваем отправку формы
            const form = document.getElementById('newYearCreditForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(form);
                    
                    fetch('universal_form_handler.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            form.innerHTML = `
                                <div class="text-center py-4">
                                    <div style="font-size: 4rem; color: #ffd700;">✅</div>
                                    <h4 style="color: #ffd700;">Спасибо за заявку!</h4>
                                    <p>Ваша заявка на кредит 12.99% принята.</p>
                                    <p>Наш менеджер свяжется с вами в течение 15 минут.</p>
                                    <button class="btn btn-warning mt-3" data-bs-dismiss="modal">
                                        Закрыть
                                    </button>
                                </div>
                            `;
                            console.log('✅ Форма кредита отправлена:', data);
                        }
                    })
                    .catch(error => {
                        console.error('❌ Ошибка отправки:', error);
                        alert('Ошибка отправки. Позвоните нам: +375 (29) 638-00-53');
                    });
                });
            }
        }
    }, 500);
    
}, 4000); // Ждем 4 секунды

console.log('⏱️ Форма кредита 12.99% откроется через 4 секунды...');
