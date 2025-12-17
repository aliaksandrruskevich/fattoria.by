// Исправление кнопок "бесплатная консультация"
document.addEventListener('DOMContentLoaded', function() {
  // Находим все кнопки консультации
  const buttons = document.querySelectorAll('button, a, .btn');
  
  buttons.forEach(btn => {
    const text = btn.textContent || btn.innerText || '';
    if (text.toLowerCase().includes('бесплатн') && 
        text.toLowerCase().includes('консультац')) {
      
      // Удаляем старые обработчики
      btn.onclick = null;
      btn.setAttribute('onclick', '');
      
      // Добавляем новый рабочий обработчик
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🟢 Кнопка "Бесплатная консультация" нажата');
        
        // Показываем простое модальное окно
        const modalHtml = `
          <div class="modal" style="display:block;background:rgba(0,0,0,0.5);position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999">
            <div style="background:white;margin:100px auto;padding:20px;max-width:500px;border-radius:10px">
              <h3>Бесплатная консультация</h3>
              <form id="consultFormSimple">
                <input type="hidden" name="form_type" value="newbuilding_consult">
                <input type="hidden" name="source" value="Новостройки - консультация">
                <div style="margin-bottom:15px">
                  <input type="text" name="name" placeholder="Ваше имя" style="width:100%;padding:10px">
                </div>
                <div style="margin-bottom:15px">
                  <input type="tel" name="phone" placeholder="Телефон" required style="width:100%;padding:10px">
                </div>
                <button type="submit" style="background:green;color:white;padding:10px 20px;border:none">Отправить</button>
                <button type="button" onclick="this.closest('.modal').remove()" style="margin-left:10px">Закрыть</button>
              </form>
            </div>
          </div>
        `;
        
        // Добавляем модалку на страницу
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv.firstElementChild);
        
        // Обработка формы
        document.getElementById('consultFormSimple').onsubmit = function(e) {
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
            modalDiv.remove();
          })
          .catch(err => {
            alert('Ошибка отправки. Позвоните: +375296380053');
          });
        };
      });
      
      console.log('✅ Исправлена кнопка:', text);
    }
  });
});
