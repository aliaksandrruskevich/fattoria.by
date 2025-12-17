// Исправляем обработку полей для формы футера
function getFormFields(form) {
  const nameField = form.querySelector('input[name="name"]') || form.querySelector('input[placeholder*="имя"]');
  const phoneField = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
  const emailField = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
  
  return { nameField, phoneField, emailField };
}
