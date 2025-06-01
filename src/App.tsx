import React, { useState, useEffect, useMemo } from 'react';
import ItemForm from './components/ItemForm';
import ItemTable from './components/ItemTable';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { ApiService } from './services/api';
import type { FormData, TableItem } from './types';

const App: React.FC = () => {
  const [items, setItems] = useState<TableItem[]>([]);
  const [editingItem, setEditingItem] = useState<TableItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 4;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await ApiService.getUsers();
      setItems(users);
    } catch (err) {
      setError('Ошибка загрузки данных. Проверьте, что JSON Server запущен.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: FormData, id?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      if (id !== undefined) {
        const updatedUser = await ApiService.updateUser(id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedUser : item))
        );
        setEditingItem(null);
      } else {
        const newUser = await ApiService.createUser(data);
        setItems((prev) => [newUser, ...prev]);
      }
    } catch (err) {
      setError('Ошибка сохранения данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ApiService.deleteUser(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Ошибка удаления пользователя');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.role.toLowerCase().includes(term)
      );
    });
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const currentItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Управление пользователями</h1>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <ItemForm
        onSubmit={handleSubmit}
        editingItem={editingItem}
        onCancel={() => setEditingItem(null)}
        loading={loading}
      />

      <div className="flex justify-between items-center mt-6">
        <SearchBar 
          value={searchTerm} 
          onChange={(value) => setSearchTerm(value)} 
        />
        <button
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Обновить'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      <ItemTable
        items={currentItems}
        onEdit={setEditingItem}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsCount={filteredItems.length}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
};

export default App;