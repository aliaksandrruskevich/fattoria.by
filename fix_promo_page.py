#!/usr/bin/env python3
import re

with open('new-year-promo.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Удаляем блок "Как нас найти" (от <!-- Контактная информация --> до закрывающего </section>)
pattern1 = r'<!-- Контактная информация -->.*?</section>'
content = re.sub(pattern1, '', content, flags=re.DOTALL)

# 2. Исправляем таймер - убираем "АКЦИЯ ЗАВЕРШЕНА" логику
# Находим функцию updateCountdown и исправляем
js_pattern = r'function updateCountdown\(\) \{.*?\}'
js_code = '''function updateCountdown() {
    const endDate = new Date('2025-01-14T23:59:59').getTime();
    const now = new Date().getTime();
    const timeLeft = endDate - now;
    
    // Всегда показываем оставшееся время, даже если акция завершена
    if (timeLeft < 0) {
        $('#countdown').html("Акция завершена");
        $('.deadline-badge').html('<i class="fas fa-times-circle"></i> Акция завершена');
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    $('#countdown').html(
      `${days} дней ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
}'''

content = re.sub(js_pattern, js_code, content, flags=re.DOTALL)

# 3. Убираем лишние отступы
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

with open('new-year-promo.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Страница исправлена!")
