#!/bin/bash
echo "=== ВОССТАНОВЛЕНИЕ ИЗ БЭКАПА ==="

if [ -z "$1" ]; then
    echo "Укажите архив бэкапа:"
    ls -la backup_*.tar.gz 2>/dev/null
    echo "Использование: ./restore_backup.sh backup_YYYYMMDD_HHMMSS.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Файл $BACKUP_FILE не найден"
    exit 1
fi

echo "Восстанавливаем из: $BACKUP_FILE"
echo "Размер: $(du -h "$BACKUP_FILE" | cut -f1)"

read -p "Вы уверены? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отмена"
    exit 0
fi

# Создаем временную папку
TEMP_DIR="restore_temp_$(date +%s)"
mkdir "$TEMP_DIR"

# Распаковываем архив
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Находим папку с бэкапом
BACKUP_DIR=$(find "$TEMP_DIR" -type d -name "backup_*" | head -1)

if [ -n "$BACKUP_DIR" ]; then
    echo "Копируем файлы из $BACKUP_DIR..."
    
    # Копируем HTML файлы
    cp "$BACKUP_DIR"/*.html . 2>/dev/null
    
    # Копируем includes если есть
    if [ -d "$BACKUP_DIR/includes" ]; then
        cp -r "$BACKUP_DIR/includes" . 2>/dev/null
    fi
    
    # Копируем CSS если есть
    if [ -d "$BACKUP_DIR/css" ]; then
        cp -r "$BACKUP_DIR/css" . 2>/dev/null
    fi
    
    # Копируем конфиги
    cp "$BACKUP_DIR/.htaccess" "$BACKUP_DIR/robots.txt" "$BACKUP_DIR/sitemap.xml" . 2>/dev/null
    
    echo "✅ Восстановление завершено"
else
    echo "❌ Не найдены файлы бэкапа в архиве"
fi

# Очищаем
rm -rf "$TEMP_DIR"
