export interface TableItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface FormData {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}
