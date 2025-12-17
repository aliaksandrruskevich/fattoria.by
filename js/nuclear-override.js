// ЯДЕРНОЕ переопределение - запускается ПОСЛЕДНИМ
setTimeout(() => {
    document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent || '';
        if (text.includes('Бесплатная консультация')) {
            // Полностью заменяем кнопку
            const newBtn = document.createElement('button');
            newBtn.className = 'btn btn-outline-warning btn-sm';
            newBtn.textContent = 'Бесплатная консультация';
            newBtn.style.cssText = btn.style.cssText;
            
            // Берем проект из оригинальной кнопки
            let project = btn.dataset.project || 'Новостройка';
            if (!btn.dataset.project && btn.onclick) {
                const match = btn.onclick.toString().match(/openContactModal\('([^']+)'\)/);
                if (match) project = match[1];
            }
            newBtn.dataset.project = project;
            
            // ОДИН обработчик
            newBtn.onclick = function() {
                alert('Консультация по ' + project + '\\nФорма заявки скоро появится\\nА пока звоните: +375 (29) 638-00-53');
                return false;
            };
            
            btn.parentNode.replaceChild(newBtn, btn);
        }
    });
    console.log('☢️ Ядерное переопределение выполнено');
}, 1000);
