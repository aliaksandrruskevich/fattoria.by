const fs = require('fs');
let content = fs.readFileSync('new-year-promo.html', 'utf8');

// Заменяем функцию таймера на правильную
const newTimerFunction = `
        // ТАЙМЕР: с 15 декабря 2025 по 14 января 2026
        function updateCountdown() {
            // Дата окончания акции
            const endDate = new Date('2026-01-14T23:59:59').getTime();
            const now = new Date().getTime();
            const timeLeft = endDate - now;
            
            // Всегда показываем положительное время
            let days, hours, minutes, seconds;
            
            if (timeLeft > 0) {
                days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            } else {
                // Если время вышло
                days = hours = minutes = seconds = 0;
            }
            
            const timerElement = document.getElementById('countdown');
            if (timerElement) {
                if (timeLeft > 0) {
                    timerElement.textContent = 
                        \`\${days} дней \${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                    timerElement.style.color = '#ffd700';
                } else {
                    timerElement.textContent = "Акция завершена";
                    timerElement.style.color = '#ff6b6b';
                }
            }
            
            // Обновляем заголовок с датами
            const dateInfo = document.getElementById('date-info');
            if (!dateInfo) {
                const dateDiv = document.createElement('div');
                dateDiv.id = 'date-info';
                dateDiv.style.fontSize = '1.2rem';
                dateDiv.style.color = '#ffd700';
                dateDiv.style.marginTop = '10px';
                dateDiv.innerHTML = '📅 Период акции: <strong>15.12.2025 - 14.01.2026</strong>';
                if (timerElement && timerElement.parentNode) {
                    timerElement.parentNode.appendChild(dateDiv);
                }
            }
        }
`;

// Заменяем старую функцию updateCountdown
const oldFunctionRegex = /function updateCountdown\(\) \{[\s\S]*?\n\s*\}/;
content = content.replace(oldFunctionRegex, newTimerFunction);

fs.writeFileSync('new-year-promo.html', content);
console.log('✅ Таймер исправлен на период 15.12.2025 - 14.01.2026');
