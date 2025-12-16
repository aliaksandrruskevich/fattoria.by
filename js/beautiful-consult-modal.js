// Создаем HTML для красивого модального окна
const consultModalHTML = `
<div class="modal fade" id="consultModal" tabindex="-1" aria-labelledby="consultModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h5 class="modal-title" id="consultModalLabel">
          <i class="fas fa-headset me-2"></i>Бесплатная консультация
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="text-center mb-4">
          <h6 class="text-muted">Оставьте заявку и наш специалист свяжется с вами в течение 15 минут</h6>
        </div>
        <form id="consultForm">
          <input type="hidden" id="consultProjectName" name="project">
          <div class="mb-3">
            <label class="form-label fw-bold">Ваше имя *</label>
            <input type="text" class="form-control form-control-lg" name="name" placeholder="Как к вам обращаться?" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Телефон *</label>
            <input type="tel" class="form-control form-control-lg" name="phone" placeholder="+375 (XX) XXX-XX-XX" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Проект</label>
            <input type="text" class="form-control" name="project_display" id="consultProjectDisplay" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Что вас интересует?</label>
            <textarea class="form-control" name="message" rows="3" placeholder="Например: 2-комнатная квартира, ипотека, рассрочка..."></textarea>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-warning btn-lg" id="consultSubmitBtn">
              <i class="fas fa-paper-plane me-2"></i>Получить консультацию
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`;

let formSubmitted = false;

function handleConsultFormSubmit(form) {
    if (formSubmitted) {
        console.log("🚫 Form already submitted, blocking duplicate");
        return;
    }
    
    const submitBtn = document.getElementById('consultSubmitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Отправка...';
    }
    
    formSubmitted = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.form_type = 'consultation';
    data.source = window.location.href;

    console.log('📤 Sending consultation data:', data);

    fetch('/api/submit-newbuilding.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(result => {
        console.log("📨 Response from server:", result);
        if (result.success) {
            showSuccessMessage();
            form.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('consultModal'));
            if (modal) modal.hide();
        } else {
            alert('❌ ' + (result.message || 'Ошибка отправки'));
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert('❌ Ошибка сети: ' + err);
    })
    .finally(() => {
        formSubmitted = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Получить консультацию';
        }
    });
}

function showSuccessMessage() {
    const successHTML = `
    <div class="alert alert-success text-center">
        <i class="fas fa-check-circle fa-2x mb-3 text-success"></i>
        <h5>Спасибо за заявку!</h5>
        <p class="mb-0">Наш специалист свяжется с вами в течение 15 минут</p>
        <small class="text-muted">Телефон для связи: +375 (29) 638-00-53</small>
    </div>
    `;

    const modalBody = document.querySelector('#consultModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = successHTML;
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('consultModal'));
            if (modal) modal.hide();
        }, 3000);
    }
}

function setupConsultModal() {
    const form = document.getElementById('consultForm');
    if (form) {
        // Удаляем старые обработчики
        form.removeEventListener('submit', handleConsultFormSubmit);
        // Добавляем новый обработчик
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleConsultFormSubmit(form);
        });
        console.log('✅ Consultation form handler setup');
    }
}

// Добавляем модальное окно на страницу
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('consultModal')) {
        document.body.insertAdjacentHTML('beforeend', consultModalHTML);
        console.log('✅ Beautiful consultation modal added to page');
        setupConsultModal();
        
        // Показываем модальное окно через 3 секунды
        setTimeout(() => {
            const modalElement = document.getElementById('consultModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('🕒 3 seconds passed - showing consult modal');
            }
        }, 3000);
    }
});

console.log('✅ Beautiful consultation modal system ready');
