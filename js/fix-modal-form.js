// ФИКС ДЛЯ ФОРМЫ В МОДАЛЬНОМ ОКНЕ - ДОБАВЛЯЕМ АТРИБУТЫ NAME
console.log('🔧 Fix for modal form fields loaded');

function fixModalFormFields() {
    const form = document.getElementById('modalContactForm');
    if (form) {
        console.log('✅ Found modalContactForm, fixing fields...');
        
        // Добавляем атрибуты name к полям если их нет
        const nameField = form.querySelector('input[type="text"]');
        if (nameField && !nameField.getAttribute('name')) {
            nameField.setAttribute('name', 'name');
        }
        
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && !phoneField.getAttribute('name')) {
            phoneField.setAttribute('name', 'phone');
        }
        
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && !emailField.getAttribute('name')) {
            emailField.setAttribute('name', 'email');
        }
        
        const messageField = form.querySelector('textarea');
        if (messageField && !messageField.getAttribute('name')) {
            messageField.setAttribute('name', 'message');
        }
        
        console.log('✅ Modal form fields fixed with name attributes');
        
        // Добавляем обработчик отправки формы
//        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleModalFormSubmit(this);
        });
        
        console.log('✅ Modal form submit handler added');
    }
}

function handleModalFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Добавляем системные данные
    data.form_type = 'newbuilding';
    data.source = window.location.href;
    data.project = document.getElementById('modalProjectName')?.value || 'Новостройки';
    
    console.log('📤 Sending modal form data:', data);
    
    fetch('/api/submit-newbuilding.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(result => {
        alert('✅ ' + result.message);
        if (result.success) {
            form.reset();
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) modal.hide();
        }
    })
    .catch(err => {
        alert('❌ Ошибка отправки: ' + err);
    });
}

// Запускаем фикс когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixModalFormFields);
} else {
    fixModalFormFields();
}

// Также фиксим форму при каждом открытии модального окна
document.addEventListener('show.bs.modal', function(e) {
    if (e.target.id === 'contactModal') {
        setTimeout(fixModalFormFields, 100);
    }
});

console.log('✅ Modal form fix ready');
