// УЛЬТИМАТИВНЫЙ ФИКС - ТОЛЬКО ЭТОТ СКРИПТ ДОЛЖЕН РАБОТАТЬ
(function() {
    console.log('🔥 УЛЬТИМАТИВНЫЙ фикс загружен');
    
    // Ждем полной загрузки страницы
    window.addEventListener('load', function() {
        console.log('🔧 Начинаем ультимативный фикс кнопок');
        
        // 1. НАХОДИМ ВСЕ кнопки консультации
        const allButtons = document.querySelectorAll('button, .btn, [class*="btn"]');
        let fixedCount = 0;
        
        allButtons.forEach((btn, index) => {
            const text = btn.textContent || btn.innerText || '';
            if (text.includes('Бесплатная консультация')) {
                console.log(`🎯 Кнопка ${index}: "${text.substring(0, 30)}..."`);
                
                // 2. УДАЛЯЕМ ВСЕ обработчики
                // Способ 1: Клонирование кнопки (удаляет все обработчики)
                const cleanBtn = btn.cloneNode(true);
                
                // 3. Определяем проект
                let project = 'Новостройка';
                
                // Из data-project
                if (btn.dataset.project) {
                    project = btn.dataset.project;
                }
                // Из onclick
                else if (btn.onclick) {
                    const match = btn.onclick.toString().match(/openContactModal\('([^']+)'\)/);
                    if (match) project = match[1];
                }
                // Из текста кнопки
                else if (btn.closest('.card') || btn.closest('.col')) {
                    const cardTitle = btn.closest('.card')?.querySelector('.card-title') ||
                                     btn.closest('.col')?.querySelector('h3, h4');
                    if (cardTitle) project = cardTitle.textContent.trim();
                }
                
                cleanBtn.dataset.project = project;
                
                // 4. ДОБАВЛЯЕМ ТОЛЬКО ОДИН обработчик
                cleanBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log(`✅ ОТКРЫТА консультация для: ${project}`);
                    
                    // Создаем простейшую модалку
                    const modalId = 'ultimate-consult-modal';
                    let modal = document.getElementById(modalId);
                    
                    if (!modal) {
                        modal = document.createElement('div');
                        modal.id = modalId;
                        modal.style.cssText = `
                            position: fixed;
                            top: 0; left: 0;
                            width: 100%; height: 100%;
                            background: rgba(0,0,0,0.8);
                            z-index: 99999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        modal.innerHTML = `
                            <div style="background: white; padding: 25px; border-radius: 10px; max-width: 400px; width: 90%">
                                <h3 style="margin-top: 0; color: #333;">Бесплатная консультация</h3>
                                <p>Проект: <strong>${project}</strong></p>
                                <form id="ultimate-consult-form">
                                    <input type="hidden" name="project" value="${project}">
                                    <div style="margin: 15px 0">
                                        <input type="text" name="name" placeholder="Ваше имя" 
                                               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px">
                                    </div>
                                    <div style="margin: 15px 0">
                                        <input type="tel" name="phone" placeholder="Телефон *" required
                                               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px">
                                    </div>
                                    <button type="submit" 
                                            style="width: 100%; padding: 14px; background: #ff9800; color: white; 
                                                   border: none; border-radius: 5px; font-weight: bold">
                                        Получить консультацию
                                    </button>
                                    <button type="button" onclick="document.getElementById('ultimate-consult-modal').remove()"
                                            style="width: 100%; padding: 10px; margin-top: 10px; background: #666; color: white; 
                                                   border: none; border-radius: 5px">
                                        Закрыть
                                    </button>
                                </form>
                            </div>
                        `;
                        document.body.appendChild(modal);
                        
                        // Обработка формы
                        document.getElementById('ultimate-consult-form').onsubmit = function(e) {
                            e.preventDefault();
                            const formData = new FormData(this);
                            const data = Object.fromEntries(formData.entries());
                            data.form_type = 'consult';
                            data.source = 'newbuildings';
                            
                            fetch('/api/submit-form-universal-fixed-v2.php', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(data)
                            })
                            .then(r => r.json())
                            .then(result => {
                                alert('✅ ' + result.message);
                                modal.remove();
                            })
                            .catch(err => {
                                alert('📞 Позвоните: +375 (29) 638-00-53');
                                modal.remove();
                            });
                        };
                    } else {
                        // Обновляем проект в существующей модалке
                        modal.querySelector('strong').textContent = project;
                        modal.querySelector('input[name="project"]').value = project;
                        modal.style.display = 'flex';
                    }
                    
                    // БЛОКИРУЕМ другие модалки
                    document.querySelectorAll('.modal').forEach(m => {
                        if (m.id !== modalId && m.style.display === 'block') {
                            m.style.display = 'none';
                        }
                    });
                    
                    return false;
                }, true); // useCapture = true - перехватываем ПЕРВЫМИ
                
                // 5. ЗАМЕНЯЕМ старую кнопку
                btn.parentNode.replaceChild(cleanBtn, btn);
                fixedCount++;
            }
        });
        
        console.log(`✅ Исправлено кнопок: ${fixedCount}`);
        
        // 6. БЛОКИРУЕМ другие возможные обработчики
        document.body.addEventListener('click', function(e) {
            if (e.target.textContent?.includes('Бесплатная консультация')) {
                e.stopImmediatePropagation();
            }
        }, true);
    });
})();
