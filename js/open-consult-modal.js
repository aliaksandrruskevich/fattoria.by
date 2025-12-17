// Функция для открытия модального окна консультации
function openContactModal(projectName) {
    console.log('📞 Открываем консультацию для:', projectName);
    
    // Создаём простое модальное окно
    const modalHtml = `
        <div class="modal fade show" style="display:block;background:rgba(0,0,0,0.5)" id="consultModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Бесплатная консультация</h5>
                        <button type="button" class="btn-close" onclick="closeConsultModal()"></button>
                    </div>
                    <div class="modal-body">
                        <p>Проект: <strong>${projectName}</strong></p>
                        <form id="consultModalForm">
                            <input type="hidden" name="project" value="${projectName}">
                            <input type="hidden" name="form_type" value="newbuilding_consult">
                            <input type="hidden" name="source" value="Страница новостроек">
                            
                            <div class="mb-3">
                                <label>Ваше имя</label>
                                <input type="text" name="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Телефон *</label>
                                <input type="tel" name="phone" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-warning w-100">Получить консультацию</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модалку на страницу
    const modalContainer = document.getElementById('modalContainer') || (() => {
        const div = document.createElement('div');
        div.id = 'modalContainer';
        document.body.appendChild(div);
        return div;
    })();
    
    modalContainer.innerHTML = modalHtml;
    
    // Обработка формы
    document.getElementById('consultModalForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        fetch('/api/submit-form-universal-fixed-v2.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(result => {
            alert(result.message || 'Заявка отправлена!');
            closeConsultModal();
        })
        .catch(err => {
            alert('Ошибка отправки. Позвоните: +375296380053');
        });
    };
}

// Функция закрытия модалки
function closeConsultModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) modalContainer.innerHTML = '';
}

// Автоматически добавляем кнопкам события, если у них class="open-modal-btn"
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.onclick = function() {
            const project = this.dataset.project || 'Неизвестный проект';
            openContactModal(project);
        };
    });
});
