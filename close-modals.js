<script>
// Закрываем все модальные окна при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('Закрываем все модальные окна...');
  
  // Закрываем Bootstrap модалки
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    document.querySelectorAll('.modal').forEach(function(modal) {
      var bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        modal.style.display = 'none';
      }
    });
  }
  
  // Удаляем backdrop
  document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
    backdrop.remove();
  });
  
  // Убираем классы с body
  document.body.classList.remove('modal-open');
  document.body.style.paddingRight = '';
  document.body.style.overflow = 'auto';
  
  // Скрываем все элементы с class="modal"
  document.querySelectorAll('.modal').forEach(function(modal) {
    modal.style.display = 'none';
  });
  
  console.log('Все модальные окна закрыты');
});

// Также запускаем сразу на случай, если DOM уже загружен
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', closeAllModals);
} else {
  closeAllModals();
}

function closeAllModals() {
  // Второй подход: просто скрываем всё
  document.querySelectorAll('[class*="modal"], [id*="Modal"]').forEach(function(el) {
    el.style.display = 'none';
  });
}
</script>
