// ФИНАЛЬНЫЙ скрипт - ТОЛЬКО ОДНА модалка
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Запускаем финальный обработчик консультаций');
    
    // Создаём модалку ОДИН раз
    const modalHTML = `
        <div class="modal fade" id="finalConsultModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title">Консультация</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Проект: <span id="finalProjectName">-</span></p>
                        <form id="finalConsultForm">
                            <input type="hidden" id="finalProjectInput" name="project">
                            <div class="mb-3">
                                <input type="text" name="name" class="form-control" placeholder="Имя" required>
                            </div>
                            <div class="mb-3">
                                <input type="tel" name="phone" class="form-control" placeholder="Телефон" required>
                            </div>
                            <button type="submit" class="btn btn-warning w-100">Отправить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модалку в DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 1. УДАЛЯЕМ ВСЕ старые обработчики
    document.querySelectorAll('.consult-btn, .open-modal-btn, button').forEach(btn => {
        if ((btn.textContent || '').includes('Бесплатная консультация')) {
            // Клонируем кнопку БЕЗ обработчиков
            const newBtn = btn.cloneNode(true);
            
            // Добавляем наш обработчик
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Важно: останавливаем ВСЕ другие обработчики
                
                const project = this.dataset.project || 'Новостройка';
                console.log('🎯 Открыта консультация для:', project);
                
                // Наполняем модалку
                document.getElementById('finalProjectName').textContent = project;
                document.getElementById('finalProjectInput').value = project;
                
                // Показываем модалку
                const modal = new bootstrap.Modal(document.getElementById('finalConsultModal'));
                modal.show();
            });
            
            // Заменяем старую кнопку новой
            btn.parentNode.replaceChild(newBtn, btn);
        }
    });
    
    // 2. Обработка формы
    document.getElementById('finalConsultForm').onsubmit = function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        data.form_type = 'consult';
        data.source = 'newbuildings';
        
        fetch('/api/submit-form-universal-fixed-v2.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(result => {
            alert(result.message);
            bootstrap.Modal.getInstance(document.getElementById('finalConsultModal')).hide();
        });
    };
    
    console.log('✅ Финальный обработчик установлен');
});

// БЛОКИРУЕМ глобально другие модалки
window.addEventListener('click', function(e) {
    if (e.target.closest('button')?.textContent?.includes('Бесплатная консультация')) {
        console.log('🛑 Заблокирован клик на кнопке консультации');
    }
}, true);
