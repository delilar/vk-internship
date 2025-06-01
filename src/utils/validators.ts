import * as Yup from 'yup';

// Кастомные методы валидации для Yup
export const phoneValidation = Yup.string()
  .required('Введите номер телефона')
  .test('phone', 'Введите корректный номер телефона', (value) => {
    if (!value) return false;
    const cleanPhone = value.replace(/[^\d\+]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  });

export const emailValidation = Yup.string()
  .trim()
  .required('Введите email')
  .email('Введите корректный email');

export const nameValidation = Yup.string()
  .trim()
  .required('Введите имя')
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(50, 'Имя не должно превышать 50 символов')
  .matches(/^[а-яёА-ЯЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы, пробелы и дефисы');

export const roleValidation = Yup.string()
  .trim()
  .required('Введите роль')
  .min(2, 'Роль должна содержать минимум 2 символа')
  .max(30, 'Роль не должна превышать 30 символов');

export const statusValidation = Yup.string()
  .required('Выберите статус')
  .oneOf(['active', 'inactive'], 'Недопустимое значение статуса');

// Основная схема валидации для формы пользователя
export const userFormValidationSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  phone: phoneValidation,
  role: roleValidation,
  status: statusValidation,
});

// Схема валидации для поиска
export const searchValidationSchema = Yup.object({
  searchTerm: Yup.string()
    .max(100, 'Поисковый запрос не должен превышать 100 символов')
    .matches(/^[^<>]*$/, 'Поисковый запрос содержит недопустимые символы'),
});

// Дополнительные валидационные функции (если нужны вне Yup)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[^\d\+]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
};

export const isValidName = (name: string): boolean => {
  const nameRegex = /^[а-яёА-ЯЁa-zA-Z\s-]+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2 && name.trim().length <= 50;
};

// Функция для валидации всех полей формы без Yup
export const validateFormData = (data: {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!isValidName(data.name)) {
    errors.name = 'Введите корректное имя (2-50 символов, только буквы)';
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Введите корректный номер телефона';
  }

  if (!data.role.trim() || data.role.trim().length < 2 || data.role.trim().length > 30) {
    errors.role = 'Введите роль (2-30 символов)';
  }

  if (!['active', 'inactive'].includes(data.status)) {
    errors.status = 'Выберите корректный статус';
  }

  return errors;
};