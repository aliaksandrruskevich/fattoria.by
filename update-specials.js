const fs = require('fs');

// Читаем данные
const data = JSON.parse(fs.readFileSync('./api/properties.json', 'utf8'));

// Сбрасываем все special: false
data.forEach(property => {
    property.special = false;
});

// Сортируем по цене (по убыванию) и берем топ-3
const sortedByPrice = data
    .filter(p => p.price && p.price > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

// Помечаем топ-3 как специальные
sortedByPrice.forEach(property => {
    property.special = true;
    console.log(`✅ Спецпредложение: ${property.title} - ${property.price}€`);
});

// Сохраняем обновленные данные
fs.writeFileSync('./api/properties.json', JSON.stringify(data, null, 2));
console.log('🎉 Спецпредложения обновлены! Топ-3 самых дорогих объектов.');
