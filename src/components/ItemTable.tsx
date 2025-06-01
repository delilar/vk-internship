import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { TableItem } from '../types';

interface ItemTableProps {
  items: TableItem[];
  onEdit: (item: TableItem) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  loading?: boolean;
}

const ItemTable: React.FC<ItemTableProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  searchTerm, 
  loading = false 
}) => {
  if (loading && items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {searchTerm ? 'Ничего не найдено по вашему запросу' : 'Нет данных для отображения'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-3">ID</th>
            <th className="border px-4 py-3">Имя</th>
            <th className="border px-4 py-3">Email</th>
            <th className="border px-4 py-3">Роль</th>
            <th className="border px-4 py-3">Статус</th>
            <th className="border px-4 py-3">Дата создания</th>
            <th className="border px-4 py-3 text-center">Действия</th>
          </tr>
        </thead>
        <tbody className={loading ? 'opacity-50' : ''}>
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-4 py-3">{item.id}</td>
              <td className="border px-4 py-3">{item.name}</td>
              <td className="border px-4 py-3">{item.email}</td>
              <td className="border px-4 py-3">{item.role}</td>
              <td className="border px-4 py-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'active' ? 'Активный' : 'Неактивный'}
                </span>
              </td>
              <td className="border px-4 py-3">{item.createdAt}</td>
              <td className="border px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => onEdit(item)} 
                    disabled={loading}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    disabled={loading}
                    className="p-1 text-red-600 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;