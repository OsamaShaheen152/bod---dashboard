export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    city: string;
    zipcode: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  user?: User;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}