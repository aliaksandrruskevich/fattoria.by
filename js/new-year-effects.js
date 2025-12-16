// ========== НОВОГОДНЕЕ ОФОРМЛЕНИЕ ==========
console.log('🎄 Загружаем новогоднее оформление...');

// Ждем загрузки основных компонентов
setTimeout(function() {
    console.log('✨ Добавляем новогодние элементы...');
    
    // 1. Баннер "АКЦИЯ"
    const banner = document.createElement('div');
    banner.innerHTML = `
        <style>
            .new-year-banner-fattoria {
                position: fixed;
                top: 120px;
                right: 20px;
                z-index: 99999;
                animation: bounce 2s infinite;
            }
            .new-year-banner-fattoria a {
                display: block;
                width: 100px;
                height: 100px;
                background: linear-gradient(45deg, #ff6b6b, #ff9500, #ffd700);
                border-radius: 50%;
                text-decoration: none;
                color: white;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                line-height: 100px;
                box-shadow: 0 10px 30px rgba(255,107,107,0.5);
                border: 3px solid white;
                transition: all 0.3s;
            }
            .new-year-banner-fattoria a:hover {
                transform: scale(1.1) rotate(10deg);
                box-shadow: 0 15px 40px rgba(255,107,107,0.7);
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @media (max-width: 768px) {
                .new-year-banner-fattoria {
                    top: 100px;
                    right: 10px;
                }
                .new-year-banner-fattoria a {
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    font-size: 14px;
                }
            }
        </style>
        <div class="new-year-banner-fattoria">
            <a href="/new-year-promo.html" title="Новогодняя акция 2025-2026">
                🎄 АКЦИЯ
            </a>
        </div>
    `;
    document.body.appendChild(banner);
    console.log('✅ Баннер "АКЦИЯ" добавлен');
    
    // 2. Снежинки
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99998;
    `;
    document.body.appendChild(snowContainer);
    
    const snowStyle = document.createElement('style');
    snowStyle.textContent = `
        .snowflake-fattoria {
            position: fixed;
            color: white;
            font-size: 20px;
            z-index: 99998;
            animation: snowFall linear infinite;
            pointer-events: none;
            text-shadow: 0 0 5px rgba(255,255,255,0.7);
        }
        @keyframes snowFall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(snowStyle);
    
    // Создаем 80 снежинок
    console.log('❄️ Создаем 80 снежинок...');
    const snowChars = ['❄', '❅', '❆'];
    
    for(let i = 0; i < 80; i++) {
        setTimeout(() => {
            const flake = document.createElement('div');
            flake.className = 'snowflake-fattoria';
            flake.textContent = snowChars[Math.floor(Math.random() * snowChars.length)];
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.top = '-50px';
            flake.style.opacity = Math.random() * 0.6 + 0.3;
            flake.style.fontSize = (Math.random() * 20 + 10) + 'px';
            flake.style.animationDuration = (Math.random() * 7 + 3) + 's';
            flake.style.animationDelay = Math.random() * 3 + 's';
            
            snowContainer.appendChild(flake);
        }, i * 30);
    }
    
    console.log('✅ 80 снежинок создано!');
    
}, 1500); // Ждем 1.5 секунды

console.log('⏱️ Новогоднее оформление будет добавлено через 1.5 секунды...');
