import { api } from './api';
import type { User, Appointment, AuthResponse, RegisterData, LoginCredentials, ApiResponse } from '../types';

// ============================================================
//  Serviço de API real — substitui o mockApi.ts
//  Todas as chamadas passam pelo Axios (api.ts) com JWT
// ============================================================

export const apiService = {
  auth: {
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return data;
    },

    async register(registerData: RegisterData): Promise<ApiResponse<User>> {
      const { data } = await api.post<ApiResponse<User>>('/auth/register', registerData);
      return data;
    },
  },

  users: {
    async findAll(): Promise<ApiResponse<User[]>> {
      const { data } = await api.get<ApiResponse<User[]>>('/users');
      return data;
    },

    async findById(id: string): Promise<ApiResponse<User>> {
      const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
      return data;
    },

    async update(id: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
      const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, updateData);
      return data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`/users/${id}`);
    },
  },

  appointments: {
    async findAll(): Promise<ApiResponse<Appointment[]>> {
      const { data } = await api.get<ApiResponse<Appointment[]>>('/appointments');
      return data;
    },

    async findById(id: string): Promise<ApiResponse<Appointment>> {
      const { data } = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
      return data;
    },

    async create(appointmentData: { title: string; description?: string; date: string }): Promise<ApiResponse<Appointment>> {
      const { data } = await api.post<ApiResponse<Appointment>>('/appointments', appointmentData);
      return data;
    },

    async update(id: string, updateData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
      const { data } = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, updateData);
      return data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`/appointments/${id}`);
    },
  },
};
