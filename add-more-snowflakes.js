const fs = require('fs');
let content = fs.readFileSync('new-year-promo.html', 'utf8');

// Увеличиваем количество снежинок в скрипте с 80 до 200
content = content.replace(/for \(let i = 0; i < 80; i\+\+\)/g, 'for (let i = 0; i < 200; i++)');

// Добавляем еще снежинки разных типов
const moreSnowScript = `
        // Добавляем больше снежинок разного вида
        function createMoreSnowflakes() {
            const types = ['❄', '❅', '❆', '＊', '✢', '✱', '✲', '❋'];
            const container = document.getElementById('snowflakes') || document.body;
            
            for (let i = 0; i < 120; i++) {
                const flake = document.createElement('div');
                flake.className = 'snowflake snowflake-' + (i % 3);
                flake.textContent = types[Math.floor(Math.random() * types.length)];
                flake.style.position = 'fixed';
                flake.style.color = 'rgba(255, 255, 255, ' + (Math.random() * 0.7 + 0.3) + ')';
                flake.style.fontSize = (Math.random() * 25 + 8) + 'px';
                flake.style.left = Math.random() * 100 + 'vw';
                flake.style.top = '-50px';
                flake.style.zIndex = '999';
                flake.style.pointerEvents = 'none';
                flake.style.userSelect = 'none';
                flake.style.animation = 'fall ' + (Math.random() * 8 + 4) + 's linear infinite';
                flake.style.animationDelay = Math.random() * 10 + 's';
                
                // Разная анимация для разных типов снежинок
                if (i % 3 === 0) {
                    flake.style.animation += ', sway 3s ease-in-out infinite';
                } else if (i % 3 === 1) {
                    flake.style.animation += ', rotate ' + (Math.random() * 10 + 5) + 's linear infinite';
                }
                
                container.appendChild(flake);
            }
        }
        
        // Анимации для снежинок
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes fall {
                to { transform: translateY(100vh) rotate(360deg); }
            }
            @keyframes sway {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(50px); }
            }
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .snowflake-0 { animation-timing-function: linear; }
            .snowflake-1 { animation-timing-function: ease-in; }
            .snowflake-2 { animation-timing-function: ease-in-out; }
        \`;
        document.head.appendChild(style);
        
        // Запускаем создание снежинок после загрузки
        setTimeout(createMoreSnowflakes, 1000);
`;

// Находим место после createSnowflakes и добавляем дополнительный скрипт
const insertPoint = content.indexOf('createSnowflakes();');
if (insertPoint !== -1) {
    const before = content.substring(0, insertPoint + 20); // +20 чтобы захватить "createSnowflakes();"
    const after = content.substring(insertPoint + 20);
    content = before + '\n' + moreSnowScript + '\n' + after;
}

fs.writeFileSync('new-year-promo.html', content);
console.log('✅ Добавлено 200+ снежинок разных типов');
