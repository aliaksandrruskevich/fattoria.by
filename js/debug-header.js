// Скрипт для отладки header
console.log('=== ОТЛАДКА HEADER ===');
console.log('1. Существует ли header-placeholder?', !!document.getElementById('header-placeholder'));
console.log('2. Содержимое header-placeholder:', document.getElementById('header-placeholder')?.innerHTML?.length || 'нет');
console.log('3. Видим ли navbar?', !!document.querySelector('.navbar'));
console.log('4. Все элементы с class="navbar":', document.querySelectorAll('.navbar').length);

// Делаем header видимым принудительно
setTimeout(() => {
  const header = document.querySelector('nav.navbar');
  if (header) {
    header.style.backgroundColor = 'red !important';
    header.style.zIndex = '9999 !important';
    header.style.position = 'relative !important';
    console.log('✅ Header найден, добавляем красный фон для видимости');
  } else {
    console.log('❌ Header не найден в DOM');
  }
}, 1000);
