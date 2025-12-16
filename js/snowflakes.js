// Простые белые/бирюзовые снежинки
document.addEventListener('DOMContentLoaded', function() {
    // Только декабрь-январь
    const now = new Date();
    const month = now.getMonth() + 1;
    const showSnow = (month === 12) || (month === 1 && now.getDate() <= 15);
    
    if (!showSnow) return;
    
    // Настройки в зависимости от устройства
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let snowflakesCount;
    if (isSmallMobile) {
        snowflakesCount = 15;
    } else if (isMobile) {
        snowflakesCount = 25;
    } else {
        snowflakesCount = 50;
    }
    
    // Создаем контейнер
    const container = document.createElement('div');
    container.id = 'snowflakes-container';
    document.body.appendChild(container);
    
    // Простые символы снежинок
    const symbols = ['❄', '❅', '❆'];
    
    // Цвета снежинок (белые, бирюзовые, голубые)
    const colors = ['white', 'light-blue', 'cyan'];
    
    // Создаем снежинки
    for (let i = 0; i < snowflakesCount; i++) {
        createSimpleSnowflake(container, symbols, colors, i, isMobile, isSmallMobile);
    }
    
    // Легкая оптимизация для мобильных
    if (isMobile) {
        simpleMobileOptimization(container);
    }
});

function createSimpleSnowflake(container, symbols, colors, index, isMobile, isSmallMobile) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // Символ
    snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Размер
    if (isSmallMobile) {
        snowflake.classList.add('tiny');
    } else if (isMobile) {
        const mobileSizes = ['tiny', 'small'];
        snowflake.classList.add(mobileSizes[Math.floor(Math.random() * mobileSizes.length)]);
    } else {
        const sizes = ['small', 'medium', 'large'];
        snowflake.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
    }
    
    // Цвет
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    snowflake.classList.add(colorClass);
    
    // Позиция
    snowflake.style.left = Math.random() * 100 + '%';
    
    // Задержка
    snowflake.style.animationDelay = (Math.random() * 15) + 's';
    
    // Скорость
    const speeds = ['slow', 'medium-speed', 'fast'];
    snowflake.classList.add(speeds[Math.floor(Math.random() * speeds.length)]);
    
    // Простая анимация
    const animations = ['snow-fall-simple', 'snow-fall-drift', 'snow-fall-rotate'];
    snowflake.style.animationName = animations[Math.floor(Math.random() * animations.length)];
    
    // Длительность
    let baseDuration = 10;
    if (snowflake.classList.contains('slow')) baseDuration = 15;
    if (snowflake.classList.contains('fast')) baseDuration = 7;
    
    snowflake.style.animationDuration = (baseDuration + Math.random() * 5) + 's';
    
    // Добавляем
    container.appendChild(snowflake);
    
    // Простой перезапуск
    snowflake.addEventListener('animationiteration', () => {
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDelay = (Math.random() * 3) + 's';
    });
}

function simpleMobileOptimization(container) {
    // Просто уменьшаем непрозрачность при прокрутке
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        container.style.opacity = '0.5';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            container.style.opacity = '1';
        }, 300);
    });
}
