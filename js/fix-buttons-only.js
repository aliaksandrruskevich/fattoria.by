// ПРОСТОЙ ФИКС ДЛЯ КНОПОК КОНСУЛЬТАЦИИ
console.log('🔧 Fix-buttons-only загружен');

document.addEventListener('click', function(e) {
    // Проверяем клик на кнопке консультации
    if (e.target.classList.contains('open-modal-btn') || 
        (e.target.textContent && e.target.textContent.includes('консультац'))) {
        
        console.log('🎯 Клик на кнопке консультации:', e.target.textContent);
        e.preventDefault();
        e.stopPropagation();
        
        // Получаем название проекта
        const project = e.target.getAttribute('data-project') || 
                       e.target.closest('.card')?.querySelector('h3, h4')?.textContent || 
                       'Новостройки';
        
        // Показываем простую форму
        showQuickForm(project);
    }
});

function showQuickForm(project) {
    const name = prompt('Консультация по: ' + project + '\n\nВаше имя:');
    if (!name) return;
    
    const phone = prompt('Ваш телефон:');
    if (!phone) return;
    
    console.log('📤 Отправка быстрой заявки:', {name, phone, project});
    
    // Отправляем на API
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

console.log('✅ Fix-buttons-only готов');
