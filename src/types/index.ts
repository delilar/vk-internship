export interface TableItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
}