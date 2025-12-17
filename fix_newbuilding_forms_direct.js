// НЕМЕДЛЕННЫЙ ФИКС ДЛЯ ФОРМ НОВОСТРОЕК
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 НЕМЕДЛЕННЫЙ ФИКС ФОРМ НОВОСТРОЕК ЗАГРУЖЕН');
    
    // Ждем немного чтобы все формы загрузились
    setTimeout(() => {
        // Находим форму новостроек по ID
        const newbuildingForm = document.getElementById('modalContactForm');
        
        if (newbuildingForm) {
            console.log('✅ Найдена форма новостроек:', newbuildingForm);
            
            // Удаляем старый обработчик и добавляем наш
            newbuildingForm.replaceWith(newbuildingForm.cloneNode(true));
            const freshForm = document.getElementById('modalContactForm');
            
            freshForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('🏢 Форма новостройки отправляется...');
                
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name') || '',
                    phone: formData.get('contact') || formData.get('phone') || '',
                    email: formData.get('email') || '',
                    message: formData.get('message') || '',
                    project: formData.get('project') || 'Новостройки',
                    form_type: 'newbuilding',
                    source: window.location.href
                };
                
                console.log('📤 Данные новостройки:', data);
                
                // ОТПРАВЛЯЕМ НА ПРАВИЛЬНЫЙ ENDPOINT
                fetch('/api/submit-newbuilding.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(result => {
                    console.log('✅ Успех новостройки:', result);
                    alert('✅ ' + result.message);
                    if (result.success) {
                        freshForm.reset();
                        // Закрываем модальное окно если есть
                        const modal = bootstrap.Modal.getInstance(document.getElementById('propertyModal'));
                        if (modal) modal.hide();
                    }
                })
                .catch(error => {
                    console.error('❌ Ошибка новостройки:', error);
                    alert('❌ Ошибка отправки. Позвоните нам: +375296380053');
                });
            });
            
            console.log('🎯 Новый обработчик формы новостроек установлен');
        } else {
            console.log('❌ Форма modalContactForm не найдена');
        }
        
        // Также перехватываем все другие формы на странице
        document.querySelectorAll('form').forEach(form => {
            if (form.id !== 'modalContactForm' && !form.hasAttribute('data-fixed')) {
                form.setAttribute('data-fixed', 'true');
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    handleGenericForm(this);
                });
            }
        });
        
    }, 1000);
});

function handleGenericForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Определяем тип формы
    let endpoint = '/api/submit-form-universal-fixed-v2.php';
    let formType = 'general';
    
    if (form.querySelector('[name*="project"]') || window.location.href.includes('новостройки')) {
        endpoint = '/api/submit-project.php';
        formType = 'project';
    }
    
    data.form_type = formType;
    data.source = window.location.href;
    
    fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(result => {
        alert(result.message || 'Заявка отправлена!');
        if (result.success) form.reset();
    })
    .catch(err => alert('Ошибка: ' + err));
}
