// ========== НОВОГОДНЯЯ ФОРМА КРЕДИТА 12.99% ==========
console.log('🏠 Загружаем новогоднюю форму кредита...');

// Ждем 5 секунд после загрузки
setTimeout(function() {
    console.log('💰 Открываем форму кредита 12.99%...');
    
    // Проверяем есть ли Bootstrap
    if (typeof bootstrap === 'undefined') {
        console.warn('⚠️ Bootstrap не загружен, пропускаем форму');
        return;
    }
    
    // Создаем модальное окно
    const modalHTML = `
    <div class="modal fade" id="newYearCreditModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="
                background: linear-gradient(135deg, #0d2818, #1a472a);
                border: 3px solid #ffd700;
                color: white;
            ">
                <div class="modal-header border-bottom border-warning">
                    <h5 class="modal-title text-warning w-100 text-center">
                        🎄 КРЕДИТ 12.99% НА НОВОСТРОЙКУ
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <div class="display-1 text-warning fw-bold">12.99%</div>
                        <p class="fs-5">Новогодняя ставка на новостройки</p>
                        <p class="text-warning">До 14 января 2026</p>
                    </div>
                    
                    <div class="mb-3">
                        <p class="mb-2">🎁 <strong>Преимущества:</strong></p>
                        <ul class="ps-3">
                            <li>Покупая через нас - получи кредит под 12.99%</li>
                            <li>Юридическое сопровождение</li>
                            <li>Подарок при оформлении до 31.12.2025</li>
                        </ul>
                    </div>
                    
                    <form id="simpleCreditForm">
                        <input type="hidden" name="form_type" value="new_year_credit">
                        <input type="hidden" name="source" value="Всплывающая форма 12.99%">
                        
                        <div class="mb-3">
                            <input type="text" class="form-control" name="name" 
                                   placeholder="Ваше имя" required>
                        </div>
                        
                        <div class="mb-3">
                            <input type="tel" class="form-control" name="phone" 
                                   placeholder="Телефон" required>
                        </div>
                        
                        <button type="submit" class="btn btn-warning w-100 fw-bold">
                            🎁 ПОЛУЧИТЬ КРЕДИТ 12.99%
                        </button>
                    </form>
                </div>
                <div class="modal-footer border-top border-warning">
                    <small class="text-center w-100 text-warning">
                        Или позвоните: +375 (29) 638-00-53
                    </small>
                </div>
            </div>
        </div>
    </div>`;
    
    // Добавляем на страницу
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Открываем модальное окно
    setTimeout(function() {
        const modalElement = document.getElementById('newYearCreditModal');
        if (modalElement) {
            try {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('✅ Форма кредита открыта!');
                
                // Настраиваем отправку
                const form = document.getElementById('simpleCreditForm');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const submitBtn = form.querySelector('button');
                        const originalText = submitBtn.innerHTML;
                        submitBtn.innerHTML = '⌛ Отправляем...';
                        submitBtn.disabled = true;
                        
                        const formData = new FormData(form);
                        
                        fetch('universal_form_handler.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                form.innerHTML = `
                                    <div class="text-center py-3">
                                        <div class="text-success fs-1">✓</div>
                                        <h5 class="text-success">Заявка отправлена!</h5>
                                        <p>Менеджер свяжется с вами в течение 15 минут.</p>
                                        <button class="btn btn-outline-warning" data-bs-dismiss="modal">
                                            Закрыть
                                        </button>
                                    </div>
                                `;
                                console.log('✅ Форма отправлена:', data);
                            }
                        })
                        .catch(err => {
                            console.error('❌ Ошибка:', err);
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                            alert('Ошибка отправки. Позвоните: +375 (29) 638-00-53');
                        });
                    });
                }
            } catch (error) {
                console.error('❌ Ошибка открытия модалки:', error);
            }
        }
    }, 500);
    
}, 5000); // Через 5 секунд

console.log('⏱️ Форма кредита откроется через 5 секунд...');
