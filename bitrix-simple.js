async function handleFormSubmission(type, formData) {
    console.log('📝 Получены данные формы (Google Forms отключен):', formData);
    
    // Всегда возвращаем успех, чтобы не блокировать отправку email
    return {
        success: true,
        message: 'Форма отправлена успешно!',
        google_sent: false
    };
}

module.exports = { handleFormSubmission };
