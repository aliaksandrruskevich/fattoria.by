// ФИКС ДЛЯ КНОПОК С НОРМАЛЬНЫМ МОДАЛЬНЫМ ОКНОМ
console.log('🔧 Fixed consultation buttons with modal loaded');

document.addEventListener('click', function(e) {
    // Проверяем клик на кнопке консультации
    if (e.target.classList.contains('open-modal-btn') || 
        (e.target.textContent && e.target.textContent.toLowerCase().includes('консультац'))) {
        
        console.log('🎯 Click on consultation button:', e.target.textContent.trim());
        
        // Получаем название проекта
        const project = e.target.getAttribute('data-project') || 
                       e.target.closest('.card')?.querySelector('h1, h2, h3, h4, h5')?.textContent || 
                       'Новостройки';
        
        // Открываем нормальное модальное окно
        openProperModal(project);
    }
});

function openProperModal(project) {
    console.log('🏢 Opening modal for project:', project);
    
    // Устанавливаем название проекта в скрытое поле
    const projectField = document.getElementById('modalProjectName');
    if (projectField) {
        projectField.value = project;
    }
    
    // Показываем модальное окно
    const modalElement = document.getElementById('contactModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        console.log('✅ Modal opened successfully');
    } else {
        console.error('❌ Modal element not found');
        // Fallback - показываем prompt если модалка не найдена
        showQuickConsultForm(project);
    }
}

// Функция-запасной вариант если модалка не работает
function showQuickConsultForm(project) {
    const name = prompt('Консультация по: ' + project + '\n\nВаше имя:');
    if (!name) return;
    
    const phone = prompt('Ваш телефон:');
    if (!phone) return;
    
    console.log('📤 Sending quick consultation:', {name, phone, project});
    
    fetch('/api/submit-newbuilding.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name,
            phone: phone,
            project: project,
            form_type: 'newbuilding',
            source: window.location.href,
            message: 'Запрос на консультацию'
        })
    })
    .then(r => r.json())
    .then(result => {
        alert('✅ ' + result.message);
    })
    .catch(err => {
        alert('❌ Ошибка: ' + err);
    });
}

console.log('✅ Fixed consultation buttons ready');
