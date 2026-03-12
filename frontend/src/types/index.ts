export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}
