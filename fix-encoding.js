const fs = require('fs');
const iconv = require('iconv-lite');

// Читаем данные
const data = JSON.parse(fs.readFileSync('./api/properties.json', 'utf8'));

// Функция для исправления кодировки
function fixEncoding(str) {
    if (!str) return str;
    // Если строка содержит кракозябры (Windows-1251 в UTF-8)
    if (str.match(/[РЎРЎРЎРЎРЎРЎ]/)) {
        try {
            const buffer = Buffer.from(str, 'binary');
            return iconv.decode(buffer, 'win1251');
        } catch (e) {
            return str;
        }
    }
    return str;
}

// Исправляем кодировку во всех строках
data.forEach(property => {
    if (property.title) property.title = fixEncoding(property.title);
    if (property.address) property.address = fixEncoding(property.address);
    if (property.district) property.district = fixEncoding(property.district);
});

// Сохраняем исправленные данные
fs.writeFileSync('./api/properties.json', JSON.stringify(data, null, 2));
console.log('✅ Кодировка исправлена!');
