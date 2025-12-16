// Google Ads Conversion Tracking
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-17659752543/QaKSCP_B78QbEN_g6eRB',
      'transaction_id': '',
      'event_callback': callback
  });
  return false;
}

// Автоматически отслеживаем отправку форм
document.addEventListener('DOMContentLoaded', function() {
  // Отслеживаем все формы
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM') {
      // Ждем успешной отправки, затем регистрируем конверсию
      setTimeout(() => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {
            'send_to': 'AW-17659752543/QaKSCP_B78QbEN_g6eRB',
            'transaction_id': 'form_submission_' + Date.now()
          });
          console.log('✅ Google Ads конверсия зарегистрирована');
        }
      }, 1000);
    }
  });
  
  // Отслеживаем кнопки консультации
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.matches('.consult-btn, .open-modal-btn, [onclick*="openContactModal"], [onclick*="openModal"]')) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-17659752543/QaKSCP_B78QbEN_g6eRB', 
          'transaction_id': 'consult_click_' + Date.now()
        });
        console.log('✅ Google Ads конверсия (клик) зарегистрирована');
      }
    }
  });
});
