import React, { useEffect, useState } from 'react';
import type { FormData, TableItem } from '../types';
import { isValidEmail } from '../utils/validators';

interface ItemFormProps {
  onSubmit: (data: FormData, id?: number) => void;
  editingItem: TableItem | null;
  onCancel: () => void;
  loading?: boolean;
}

const initialForm: FormData = {
  name: '',
  email: '',
  role: '',
  status: 'active',
};

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, editingItem, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        email: editingItem.email,
        role: editingItem.role,
        status: editingItem.status,
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.email.trim() || !isValidEmail(formData.email)) newErrors.email = 'Введите корректный email';
    if (!formData.role.trim()) newErrors.role = 'Введите роль';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    
    await onSubmit(formData, editingItem?.id);
    
    if (!editingItem) {
      setFormData(initialForm);
    }
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setErrors({});
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Имя</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Роль</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
          className="w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Статус</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          className="w-full border px-3 py-2 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="active">Активный</option>
          <option value="inactive">Неактивный</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        {editingItem && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Сохранение...' : (editingItem ? 'Сохранить' : 'Добавить')}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;