import axios from 'axios';
import type { TableItem, FormData } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  static async getUsers(): Promise<TableItem[]> {
    try {
      const response = await apiClient.get<TableItem[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async createUser(userData: FormData): Promise<TableItem> {
    try {
      const newUser = {
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const response = await apiClient.post<TableItem>('/users', newUser);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: number, userData: FormData): Promise<TableItem> {
    try {
      const response = await apiClient.put<TableItem>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async searchUsers(searchTerm: string): Promise<TableItem[]> {
    if (!searchTerm.trim()) {
      return this.getUsers();
    }

    try {
      const response = await apiClient.get<TableItem[]>('/users', {
        params: {
          q: searchTerm,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  static async getUsersWithPagination(page: number, limit: number): Promise<{
    data: TableItem[];
    total: number;
  }> {
    try {
      const response = await apiClient.get<TableItem[]>('/users', {
        params: {
          _page: page,
          _limit: limit,
        },
      });

      const total = parseInt(response.headers['x-total-count'] || '0');

      return {
        data: response.data,
        total,
      };
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      throw error;
    }
  }
}