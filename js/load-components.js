// Динамическая подгрузка навигации и других компонентов
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Начинаем загрузку компонентов');

  // Подгрузка навигации из includes/header.html
  fetch('/includes/header.html')
    .then(response => {
      console.log('📡 Ответ навигации:', response.status);
      if (!response.ok) {
        throw new Error('Ошибка загрузки навигации: ' + response.status);
      }
      return response.text();
    })
    .then(html => {
      console.log('✅ Навигация загружена, длина:', html.length);
      // Вставляем навигацию в элемент с id="header-placeholder"
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = html;
        console.log('📝 Навигация вставлена');
        // Инициализируем обработчики форм после загрузки хедера
        // initializeFormHandlers();

      } else {
        console.error('❌ header-placeholder не найден');
      }
    })
    .catch(error => {
      console.error('❌ Ошибка при загрузке навигации:', error);
    });

  // Подгрузка футера из includes/footer.html
  fetch('/includes/footer.html')
    .then(response => {
      console.log('📡 Ответ футера:', response.status);
      if (!response.ok) {
        throw new Error('Ошибка загрузки футера: ' + response.status);
      }
      return response.text();
    })
    .then(html => {
      console.log('✅ Футер загружен, длина:', html.length);
      // Вставляем футер в элемент с id="footer-placeholder"
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = html;
        console.log('📝 Футер вставлен');

        // Инициализируем AOS после загрузки футера
        if (typeof AOS !== 'undefined') {
          AOS.init({ duration: 1000, once: true });
        }

        // Инициализируем обработчики форм после загрузки футера
        initializeFormHandlers();

        // Инициализируем обработчики модальных окон
        initializeModalHandlers();

        console.log('🎯 Формы футера должны быть инициализированы');
      } else {
        console.error('❌ footer-placeholder не найден');
      }
    })
    .catch(error => {
      console.error('❌ Ошибка при загрузке футера:', error);
    });
});

// Функция для инициализации обработчиков форм
function initializeFormHandlers() {
  // Инициализируем формы в хедере
  const testDriveForm = document.getElementById('testDriveForm');
  const trustCallbackForm = document.getElementById('trustCallbackForm');

  if (testDriveForm) {
    testDriveForm.addEventListener('submit', handleFormSubmission);
  }

  if (trustCallbackForm) {
    trustCallbackForm.addEventListener('submit', handleFormSubmission);
  }

  // Инициализируем формы в футере
  const feedbackFormBottom = document.getElementById('feedbackFormBottom');
  if (feedbackFormBottom) {
    feedbackFormBottom.addEventListener('submit', handleFormSubmission);
  }

  // Форма contactForm теперь обрабатывается в forms.js
}

// Функция для обработки отправки форм
function handleFormSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Собираем данные формы
  const data = {
    name: form.querySelector('input[name="name"]')?.value || '',
    phone: form.querySelector('input[name="phone"]')?.value || '',
    email: form.querySelector('input[name="email"]')?.value || '',
    message: form.querySelector('input[name="message"]')?.value || '',
    address: form.querySelector('input[name="address"]')?.value || '',
    request: form.querySelector('input[name="request"]')?.value || '',
    project: getProjectName(),
    timestamp: new Date().toISOString(),
    source: window.location.pathname
  };

  // Показываем индикатор загрузки
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Отправляем...';

  // Отправляем форму
  submitFormData(data)
    .then(success => {
      if (success) {
        showNotification('Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.', 'success');
        form.reset();
      } else {
        showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
}

// Функция для получения названия проекта
function getProjectName() {
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    const title = titleElement.textContent.trim();
    if (title && title !== 'Новостройки') {
      return title;
    }
  }

  const path = window.location.pathname;
  const pathParts = path.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart && lastPart !== 'новостройки.html') {
    return lastPart.replace('.html', '').replace(/-/g, ' ');
  }

  return 'Главная страница';
}

// Функция для отправки данных формы
async function submitFormData(data) {
  try {
    // Отправляем данные на Google Apps Script
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch(window.scriptURL || "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", { // TODO: Замените YOUR_SCRIPT_ID на реальный ID Google Apps Script
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.log('Form submission failed:', error);
    return false;
  }
}

// Функция для сохранения в localStorage
function saveToLocalStorage(data) {
  try {
    const existingForms = JSON.parse(localStorage.getItem('pendingForms') || '[]');
    existingForms.push(data);
    localStorage.setItem('pendingForms', JSON.stringify(existingForms));
  } catch (error) {
    console.error('localStorage save failed:', error);
  }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
  // Удаляем существующие уведомления
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Добавляем стили
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
    max-width: 500px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  `;

  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(notification);

  // Анимация появления
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Обработчик закрытия
  closeBtn.addEventListener('click', () => {
    closeNotification(notification);
  });

  // Автоматическое закрытие через 5 секунд
  setTimeout(() => {
    if (document.body.contains(notification)) {
      closeNotification(notification);
    }
  }, 5000);
}

function closeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Функция для инициализации обработчиков модальных окон
function initializeModalHandlers() {
    // Добавляем обработчики событий для ссылок в футере после его загрузки
    const privacyLink = document.querySelector('a[onclick="showPrivacyModal()"]');
    const termsLink = document.querySelector('a[onclick="showTermsModal()"]');

    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPrivacyModal();
        });
    }

    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTermsModal();
        });
    }
}

// Функция для инициализации обработчиков навигации
function initializeNavigationHandlers() {
  // Добавляем обработчики для всех ссылок навигации
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      // Проверяем, является ли ссылка навигационной (не внешней, не якорной)
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        // Не предотвращаем стандартное поведение для нормальной навигации
        // e.preventDefault();
        // Переходим на страницу
        // window.location.href = href;
      }
    }
  });
}

// Глобальные функции для модальных окон политики конфиденциальности и пользовательского соглашения
function showPrivacyModal() {
    // Создаем модальное окно политики конфиденциальности
    const modalHtml = `
        <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="privacyModalLabel">Политика конфиденциальности</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>1. Общие положения</h6>
                        <p>Настоящая политика конфиденциальности определяет порядок обработки и защиты информации о физических и юридических лицах, использующих сервисы агентства недвижимости "Fattoria.by".</p>

                        <h6>2. Сбор информации</h6>
                        <p>Мы собираем следующие виды информации:</p>
                        <ul>
                            <li>Личную информацию (имя, телефон, email), предоставляемую пользователями при заполнении форм</li>
                            <li>Техническую информацию (IP-адрес, тип браузера, время посещения)</li>
                            <li>Информацию о предпочтениях пользователей при поиске недвижимости</li>
                        </ul>

                        <h6>3. Использование информации</h6>
                        <p>Собираемая информация используется для:</p>
                        <ul>
                            <li>Предоставления консультаций по недвижимости</li>
                            <li>Отправки информационных материалов и предложений</li>
                            <li>Улучшения качества обслуживания</li>
                            <li>Анализа посещаемости сайта</li>
                        </ul>

                        <h6>4. Защита информации</h6>
                        <p>Мы принимаем все необходимые меры для защиты вашей информации от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>

                        <h6>5. Ваши права</h6>
                        <p>Вы имеете право:</p>
                        <ul>
                            <li>Получать информацию о обработке ваших данных</li>
                            <li>Требовать исправления неточных данных</li>
                            <li>Требовать удаления ваших данных</li>
                            <li>Отозвать согласие на обработку данных</li>
                        </ul>

                        <h6>6. Контактная информация</h6>
                        <p>По вопросам обработки данных обращайтесь:</p>
                        <ul>
                            <li>Телефон: +375 (44) 702-52-67</li>
                            <li>Email: ruskevichegor@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавляем модальное окно в DOM, если оно еще не существует
    if (!document.getElementById('privacyModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('privacyModal'));
    modal.show();
}

function showTermsModal() {
    // Создаем модальное окно пользовательского соглашения
    const modalHtml = `
        <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="termsModalLabel">Пользовательское соглашение</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>1. Общие положения</h6>
                        <p>Настоящее пользовательское соглашение регулирует отношения между агентством недвижимости "АН Фаттория" и пользователями сайта.</p>

                        <h6>2. Предмет соглашения</h6>
                        <p>Агентство предоставляет пользователям доступ к информационным материалам о недвижимости и услугам по подбору объектов.</p>

                        <h6>3. Права и обязанности сторон</h6>
                        <p><strong>Пользователь имеет право:</strong></p>
                        <ul>
                            <li>Получать информацию о доступных объектах недвижимости</li>
                            <li>Пользоваться формами обратной связи</li>
                            <li>Подписываться на информационные рассылки</li>
                        </ul>

                        <p><strong>Пользователь обязуется:</strong></p>
                        <ul>
                            <li>Предоставлять достоверную информацию</li>
                            <li>Не нарушать законодательство Республики Беларусь</li>
                            <li>Уважать права третьих лиц</li>
                        </ul>

                        <h6>4. Ответственность</h6>
                        <p>Агентство не несет ответственности за неточности в информации, предоставленной третьими лицами, а также за технические сбои в работе сайта.</p>

                        <h6>5. Изменение условий</h6>
                        <p>Агентство оставляет за собой право вносить изменения в настоящее соглашение без предварительного уведомления пользователей.</p>

                        <h6>6. Контактная информация</h6>
                        <p>По вопросам использования сайта обращайтесь:</p>
                        <ul>
                            <li>Телефон: +375 (44) 702-52-67</li>
                            <li>Email: ruskevichegor@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавляем модальное окно в DOM, если оно еще не существует
    if (!document.getElementById('termsModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('termsModal'));
    modal.show();
}
// ==================== НОВОГОДНЯЯ ФОРМА 12.99% (зеленая) ====================
// Показывается всегда в новогодний период

(function() {
    console.log('🎄 Инициализация зеленой новогодней формы 12.99%...');
    
    // Ждем полную загрузку страницы + 2 секунды
    setTimeout(function() {
        // Проверяем время года (только декабрь-первая половина января)
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const day = now.getDate();
        const isNewYearPeriod = (month === 12) || (month === 1 && day <= 15);
        
        if (!isNewYearPeriod) {
            console.log('📅 Не новогодний период, форма не показывается');
            return;
        }
        
        // Создаем HTML модалки
        const modalHTML = `
        <div class="modal fade" id="newYearCreditModal2025" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 550px;">
                <div class="modal-content new-year-modal-2025" style="
                    border: 3px solid #2E7D32;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 15px 40px rgba(46, 125, 50, 0.2);
                    background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
                ">
                    <!-- Новогодний декор -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 100%;
                        pointer-events: none;
                        overflow: hidden;
                        z-index: 0;
                    ">
                        <!-- Сосновые ветки -->
                        <div style="
                            position: absolute;
                            top: -20px;
                            left: -20px;
                            width: 100px;
                            height: 100px;
                            background: #1B5E20;
                            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                            opacity: 0.1;
                            transform: rotate(45deg);
                        "></div>
                        <div style="
                            position: absolute;
                            bottom: -20px;
                            right: -20px;
                            width: 120px;
                            height: 120px;
                            background: #2E7D32;
                            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                            opacity: 0.1;
                            transform: rotate(225deg);
                        "></div>
                        
                        <!-- Новогодние шарики -->
                        <div style="
                            position: absolute;
                            top: 30px;
                            right: 40px;
                            width: 20px;
                            height: 20px;
                            background: #C62828;
                            border-radius: 50%;
                            opacity: 0.15;
                        "></div>
                        <div style="
                            position: absolute;
                            bottom: 50px;
                            left: 40px;
                            width: 25px;
                            height: 25px;
                            background: #FFD700;
                            border-radius: 50%;
                            opacity: 0.15;
                        "></div>
                    </div>
                    
                    <!-- Заголовок -->
                    <div class="modal-header border-0" style="
                        background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%);
                        padding: 25px 30px;
                        position: relative;
                        z-index: 1;
                    ">
                        <div class="w-100 text-center position-relative">
                            <div style="
                                font-size: 2.5rem;
                                line-height: 1;
                                margin-bottom: 10px;
                                color: #FFD700;
                            ">
                                🎄🎁
                            </div>
                            <h2 class="modal-title mb-2" style="
                                color: #ffffff; 
                                font-weight: 700; 
                                font-size: 1.6rem;
                                letter-spacing: 0.5px;
                            ">
                                НОВОГОДНЕЕ ПРЕДЛОЖЕНИЕ
                            </h2>
                            <div style="
                                font-size: 3.8rem;
                                font-weight: 900;
                                color: #FFD700;
                                line-height: 1;
                                margin: 10px 0;
                                text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
                            ">
                                12,99%
                            </div>
                            <p style="
                                color: #ffffff; 
                                font-size: 1.1rem;
                                margin: 0;
                                font-weight: 500;
                                opacity: 0.9;
                            ">
                                специальная ставка на новостройки
                            </p>
                            <button type="button" class="btn-close btn-close-white position-absolute" 
                                    data-bs-dismiss="modal" aria-label="Закрыть"
                                    style="
                                        top: 20px;
                                        right: 20px;
                                        opacity: 0.8;
                                        background: none;
                                        font-size: 1.5rem;
                                        width: 30px;
                                        height: 30px;
                                    ">
                                &times;
                            </button>
                        </div>
                    </div>
                    
                    <!-- Тело модалки -->
                    <div class="modal-body p-4" style="
                        position: relative;
                        z-index: 1;
                    ">
                        <div class="text-center mb-4">
                            <div style="color: #333; font-size: 1rem; margin-bottom: 20px;">
                                <strong>Действует до 14 января 2026 года</strong>
                            </div>
                            
                            <div style="
                                display: flex;
                                justify-content: center;
                                gap: 10px;
                                margin-bottom: 25px;
                                flex-wrap: wrap;
                            ">
                                <div style="
                                    background: #E8F5E9;
                                    border: 1px solid #C8E6C9;
                                    border-radius: 10px;
                                    padding: 10px 15px;
                                    min-width: 150px;
                                ">
                                    <div style="font-size: 1.8rem; color: #2E7D32; margin-bottom: 5px;">🏠</div>
                                    <div style="color: #333; font-weight: 600; font-size: 0.9rem;">Новостройки</div>
                                </div>
                                
                                <div style="
                                    background: #E8F5E9;
                                    border: 1px solid #C8E6C9;
                                    border-radius: 10px;
                                    padding: 10px 15px;
                                    min-width: 150px;
                                ">
                                    <div style="font-size: 1.8rem; color: #2E7D32; margin-bottom: 5px;">🏦</div>
                                    <div style="color: #333; font-weight: 600; font-size: 0.9rem;">Банки-партнеры</div>
                                </div>
                            </div>
                        </div>
                        
                        <form id="newYearCreditForm2025" class="new-year-form-2025">
                            <input type="hidden" name="form_type" value="new_year_credit_12_99">
                            <input type="hidden" name="source" value="Новогодняя всплывающая форма">
                            <input type="hidden" name="campaign" value="newyear2025_12_99_credit">
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold" style="color: #333; margin-bottom: 8px;">
                                    Ваше имя *
                                </label>
                                <input type="text" class="form-control" 
                                       name="name" placeholder="Иван Иванов" required
                                       style="
                                            border: 2px solid #C8E6C9;
                                            border-radius: 8px;
                                            padding: 12px 15px;
                                            background: white;
                                            color: #333;
                                       ">
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold" style="color: #333; margin-bottom: 8px;">
                                    Телефон *
                                </label>
                                <input type="tel" class="form-control" 
                                       name="phone" placeholder="+375 (29) 123-45-67" required
                                       style="
                                            border: 2px solid #C8E6C9;
                                            border-radius: 8px;
                                            padding: 12px 15px;
                                            background: white;
                                            color: #333;
                                       ">
                            </div>
                            
                            <div class="mb-4">
                                <label class="form-label fw-bold" style="color: #333; margin-bottom: 8px;">
                                    Жилой комплекс
                                </label>
                                <select class="form-select" name="project"
                                        style="
                                            border: 2px solid #C8E6C9;
                                            border-radius: 8px;
                                            padding: 12px 15px;
                                            background: white;
                                            color: #333;
                                       ">
                                    <option value="">Выберите ЖК...</option>
                                    <option value="жк-зеленая-гавань">🌲 ЖК "Зелёная гавань"</option>
                                    <option value="жк-минск-мир">🏙️ ЖК "Минск-Мир"</option>
                                    <option value="жк-фарфоровый">🏘️ ЖК "Фарфоровый"</option>
                                    <option value="жк-новая-боровая">🌳 ЖК "Новая Боровая"</option>
                                    <option value="не определился">❓ Еще не определился</option>
                                </select>
                            </div>
                            
                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" 
                                       id="newYearAgreement2025" required
                                       style="
                                            border: 2px solid #C8E6C9;
                                            width: 18px;
                                            height: 18px;
                                            margin-top: 0.2rem;
                                       ">
                                <label class="form-check-label" for="newYearAgreement2025" 
                                        style="color: #333; font-size: 0.9rem; line-height: 1.4;">
                                    Согласен на обработку персональных данных
                                </label>
                            </div>
                            
                            <button type="submit" class="btn w-100 py-3 fw-bold" style="
                                background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
                                color: white;
                                font-size: 1.1rem;
                                border-radius: 10px;
                                border: none;
                                transition: all 0.3s;
                                margin-top: 10px;
                                position: relative;
                                overflow: hidden;
                            ">
                                <span style="
                                    position: relative;
                                    z-index: 2;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 10px;
                                ">
                                    <i class="fas fa-tree"></i>
                                    ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ
                                    <i class="fas fa-arrow-right"></i>
                                </span>
                            </button>
                        </form>
                        
                        <div class="text-center mt-4 pt-3" style="border-top: 1px solid #E0E0E0;">
                            <small style="color: #666; font-size: 0.85rem;">
                                <i class="fas fa-phone-alt me-1"></i>
                                Или позвоните: 
                                <a href="tel:+375296380053" style="color: #2E7D32; text-decoration: none; font-weight: 600;">
                                    +375 (29) 638-00-53
                                </a>
                            </small>
                        </div>
                    </div>
                    
                    <!-- Футер -->
                    <div class="modal-footer justify-content-center border-0" style="
                        background: #F1F8E9;
                        padding: 15px;
                        position: relative;
                        z-index: 1;
                        border-top: 1px solid #E0E0E0;
                    ">
                        <small style="color: #555; font-size: 0.85rem; text-align: center;">
                            ⭐ Успейте оформить кредит на выгодных условиях!
                        </small>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .new-year-modal-2025 {
                animation: modalSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .new-year-form-2025 .form-control:focus,
            .new-year-form-2025 .form-select:focus {
                border-color: #2E7D32 !important;
                box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15) !important;
                outline: none;
            }
            
            .new-year-form-2025 button[type="submit"]:hover {
                background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%) !important;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
            }
            
            .new-year-form-2025 button[type="submit"]:active {
                transform: translateY(0);
            }
            
            .form-check-input:checked {
                background-color: #2E7D32 !important;
                border-color: #2E7D32 !important;
            }
            
            .form-check-input:focus {
                border-color: #2E7D32 !important;
                box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15) !important;
            }
        </style>
        `;
        
        // Добавляем модалку в DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Открываем модалку через небольшую задержку
        setTimeout(function() {
            const modalElement = document.getElementById('newYearCreditModal2025');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                console.log('✅ Зеленая новогодняя форма 12.99% открыта!');
                
                // Настраиваем отправку формы
                const form = document.getElementById('newYearCreditForm2025');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const submitBtn = form.querySelector('button[type="submit"]');
                        const originalText = submitBtn.innerHTML;
                        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправка...';
                        submitBtn.disabled = true;
                        
                        // Собираем данные формы
                        const formData = new FormData(form);
                        formData.append('page_url', window.location.href);
                        formData.append('timestamp', new Date().toISOString());
                        
                        // Отправляем на существующий обработчик
                        fetch('universal_form_handler.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            if (response.ok) {
                                // Успех - элегантное подтверждение
                                form.innerHTML = `
                                    <div class="text-center py-4" style="position: relative; z-index: 2;">
                                        <div style="
                                            font-size: 4rem;
                                            margin-bottom: 20px;
                                            color: #2E7D32;
                                        ">
                                            ✅
                                        </div>
                                        <h4 style="color: #333; font-weight: 700; margin-bottom: 15px;">
                                            Заявка принята!
                                        </h4>
                                        <p class="mb-3" style="color: #555; font-size: 1rem;">
                                            <strong>Спасибо за интерес к нашему новогоднему предложению.</strong>
                                        </p>
                                        <p class="mb-4" style="color: #666; font-size: 0.95rem;">
                                            Наш специалист свяжется с вами в течение 15 минут<br>
                                            для консультации по кредиту под <strong>12,99%</strong>
                                        </p>
                                        <button class="btn" data-bs-dismiss="modal" style="
                                            background: #2E7D32;
                                            color: white;
                                            padding: 10px 30px;
                                            border-radius: 8px;
                                            border: none;
                                            font-weight: 600;
                                        ">
                                            Закрыть
                                        </button>
                                        <div class="mt-4 pt-3" style="border-top: 1px solid #E0E0E0;">
                                            <small style="color: #777; font-size: 0.85rem;">
                                                🎄 С наступающим Новым Годом! 🎄
                                            </small>
                                        </div>
                                    </div>
                                `;
                                
                                // Отслеживаем конверсию
                                if (typeof gtag !== 'undefined') {
                                    gtag('event', 'conversion', {
                                        'send_to': 'AW-17659752543',
                                        'value': 1.0,
                                        'currency': 'BYN',
                                        'transaction_id': 'newyear_credit_' + Date.now()
                                    });
                                }
                                
                                console.log('✅ Форма кредита отправлена успешно');
                            } else {
                                throw new Error('Network response was not ok');
                            }
                        })
                        .catch(error => {
                            console.error('❌ Ошибка отправки формы:', error);
                            
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                            
                            // Показываем сообщение об ошибке
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'alert alert-danger mt-3';
                            errorDiv.innerHTML = `
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <span style="color: #333;">Ошибка отправки. Пожалуйста, позвоните нам:</span><br>
                                <a href="tel:+375296380053" style="color: #2E7D32; font-weight: 600; text-decoration: none;">
                                    +375 (29) 638-00-53
                                </a>
                            `;
                            errorDiv.style.position = 'relative';
                            errorDiv.style.zIndex = '2';
                            errorDiv.style.background = '#FFEBEE';
                            errorDiv.style.borderColor = '#EF9A9A';
                            errorDiv.style.color = '#333';
                            form.appendChild(errorDiv);
                        });
                    });
                }
                
                // Автозакрытие через 60 секунд
                setTimeout(function() {
                    if (modalElement.classList.contains('show')) {
                        modal.hide();
                        console.log('⏱️ Форма автоматически закрыта (60 секунд)');
                    }
                }, 60000);
                
            } else {
                console.error('❌ Не удалось открыть модалку: Bootstrap не загружен');
            }
        }, 300);
        
    }, 2000); // Основная задержка 2 секунды
    
})();

console.log('🌲 Зеленая новогодняя форма 12.99% инициализирована');
