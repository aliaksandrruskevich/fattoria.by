// ЕДИНСТВЕННЫЙ скрипт для модалки консультаций на странице новостроек
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Загружаем модалку
  fetch('/includes/newbuilding-consult-modal.html')
    .then(r => r.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      console.log('✅ Модалка консультаций загружена');
    })
    .catch(err => console.log('⚠️ Не удалось загрузить модалку:', err));
  
  // 2. Находим ВСЕ кнопки "Бесплатная консультация" и вешаем ОДИН обработчик
  setTimeout(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      const btnText = btn.textContent || '';
      if (btnText.includes('Бесплатная консультация')) {
        
        // Получаем название проекта
        let projectName = 'Новостройка';
        if (btn.dataset.project) {
          projectName = btn.dataset.project;
        } else if (btn.onclick) {
          const match = btn.onclick.toString().match(/openContactModal\('([^']+)'\)/);
          if (match) projectName = match[1];
        }
        
        // Удаляем ВСЕ старые обработчики
        btn.onclick = null;
        btn.setAttribute('onclick', '');
        
        // Вешаем ЕДИНСТВЕННЫЙ обработчик
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('🎯 Открываем консультацию для:', projectName);
          
          // Устанавливаем проект в модалке
          document.getElementById('consultProjectNameText').textContent = projectName;
          document.getElementById('consultProject').value = projectName;
          
          // Показываем модалку через Bootstrap
          const modalElement = document.getElementById('newbuildingConsultModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          } else {
            // Fallback: простая модалка
            alert('Консультация по ' + projectName + '\nЗвоните: +375 (29) 638-00-53');
          }
        }, true); // useCapture=true - перехватываем первыми
        
        console.log('✅ Кнопка настроена:', projectName);
      }
    });
    
    console.log('✅ Всего настроено кнопок:', buttons.length);
  }, 1000);
  
  // 3. Обработка формы модалки (после её загрузки)
  setTimeout(() => {
    const form = document.getElementById('newbuildingConsultForm');
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Кнопка отправки
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
        
        // Отправляем на API
        fetch('/api/submit-form-universal-fixed-v2.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(result => {
          alert('✅ ' + result.message);
          
          // Закрываем модалку
          const modalElement = document.getElementById('newbuildingConsultModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
          }
          
          // Сбрасываем форму
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        })
        .catch(error => {
          alert('⚠️ Ошибка отправки. Позвоните: +375 (29) 638-00-53');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
      };
      
      console.log('✅ Форма настроена');
    }
  }, 1500);
});

// Отключаем другие модалки на этой странице
window.disableOtherModals = true;
