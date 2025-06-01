import type { FC } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { FormData, TableItem } from '../types';

interface ItemFormProps {
  onSubmit: (data: FormData, id?: number) => void;
  editingItem: TableItem | null;
  onCancel: () => void;
  loading?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Введите имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  
  email: Yup.string()
    .trim()
    .required('Введите email')
    .email('Введите корректный email'),
  
  phone: Yup.string()
    .required('Введите номер телефона')
    .test('phone', 'Введите корректный номер телефона', (value) => {
      if (!value) return false;
      const cleanPhone = value.replace(/[^\d\+]/g, '');
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }),
  
  role: Yup.string()
    .trim()
    .required('Введите роль')
    .min(2, 'Роль должна содержать минимум 2 символа')
    .max(30, 'Роль не должна превышать 30 символов'),
  
  status: Yup.string()
    .required('Выберите статус')
    .oneOf(['active', 'inactive'], 'Недопустимое значение статуса')
});

const initialValues: FormData = {
  name: '',
  email: '',
  phone: '',
  role: '',
  status: 'active',
};

const ItemForm: FC<ItemFormProps> = ({ 
  onSubmit, 
  editingItem, 
  onCancel, 
  loading = false 
}) => {
  return (
    <Formik
      initialValues={editingItem ? {
        name: editingItem.name,
        email: editingItem.email,
        phone: editingItem.phone,
        role: editingItem.role,
        status: editingItem.status,
      } : initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit(values, editingItem?.id);
          
          if (!editingItem) {
            resetForm();
          }
        } catch (error) {
          console.error('Ошибка при отправке формы:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, resetForm, errors, touched }) => (
        <Form className="space-y-4 bg-white p-6 rounded-md shadow">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Имя
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              disabled={loading || isSubmitting}
              className={`w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage 
              name="name" 
              component="p" 
              className="text-sm text-red-600 mt-1" 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              disabled={loading || isSubmitting}
              className={`w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage 
              name="email" 
              component="p" 
              className="text-sm text-red-600 mt-1" 
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Телефон
            </label>
            <Field
              type="tel"
              id="phone"
              name="phone"
              placeholder="+7 (xxx) xxx-xx-xx"
              disabled={loading || isSubmitting}
              className={`w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage 
              name="phone" 
              component="p" 
              className="text-sm text-red-600 mt-1" 
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Роль
            </label>
            <Field
              type="text"
              id="role"
              name="role"
              disabled={loading || isSubmitting}
              className={`w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.role && touched.role ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage 
              name="role" 
              component="p" 
              className="text-sm text-red-600 mt-1" 
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Статус
            </label>
            <Field
              as="select"
              id="status"
              name="status"
              disabled={loading || isSubmitting}
              className={`w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.status && touched.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
            </Field>
            <ErrorMessage 
              name="status" 
              component="p" 
              className="text-sm text-red-600 mt-1" 
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onCancel();
                }}
                disabled={loading || isSubmitting}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting 
                ? 'Сохранение...' 
                : (editingItem ? 'Сохранить' : 'Добавить')
              }
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ItemForm;