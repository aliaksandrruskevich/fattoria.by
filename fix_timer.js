// Простейший таймер который всегда работает
function simpleCountdown() {
    const end = new Date('2025-01-14T23:59:59').getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    // Всегда положительные значения
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
    
    return `${days} дней ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Использование:
// $('#countdown').text(simpleCountdown());
// setInterval(() => $('#countdown').text(simpleCountdown()), 1000);
