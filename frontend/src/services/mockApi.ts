import { User, Appointment, AuthResponse, RegisterData, LoginCredentials, ApiResponse } from '../types';

// Simula latência de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mock
const mockUsers: User[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'ADMIN', createdAt: '2026-01-15T10:00:00Z' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'CLIENT', createdAt: '2026-02-10T14:30:00Z' },
  { id: '3', name: 'Carlos Lima', email: 'carlos@email.com', role: 'CLIENT', createdAt: '2026-03-01T09:00:00Z' },
];

const mockAppointments: Appointment[] = [
  {
    id: '1', title: 'Consultoria de Marketing', description: 'Reunião para definir estratégia digital',
    date: '2026-04-01T10:00:00Z', status: 'CONFIRMED', userId: '2',
    user: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    createdAt: '2026-03-20T08:00:00Z', updatedAt: '2026-03-20T08:00:00Z',
  },
  {
    id: '2', title: 'Sessão de Design', description: 'Criação de identidade visual',
    date: '2026-04-03T14:00:00Z', status: 'PENDING', userId: '3',
    user: { id: '3', name: 'Carlos Lima', email: 'carlos@email.com' },
    createdAt: '2026-03-21T11:00:00Z', updatedAt: '2026-03-21T11:00:00Z',
  },
  {
    id: '3', title: 'Aula de Fotografia', description: 'Workshop de fotografia de produto',
    date: '2026-04-05T09:00:00Z', status: 'PENDING', userId: '2',
    user: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    createdAt: '2026-03-22T15:00:00Z', updatedAt: '2026-03-22T15:00:00Z',
  },
  {
    id: '4', title: 'Mentoria de Negócios', description: 'Sessão de coaching empresarial',
    date: '2026-03-28T16:00:00Z', status: 'CANCELLED', userId: '3',
    user: { id: '3', name: 'Carlos Lima', email: 'carlos@email.com' },
    createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-25T10:00:00Z',
  },
];

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';

export const mockApi = {
  auth: {
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
      await delay(800);
      const user = mockUsers.find((u) => u.email === credentials.email);
      if (!user || credentials.password.length < 6) {
        throw { response: { data: { status: 'error', message: 'Credenciais inválidas' } } };
      }
      return { status: 'success', data: { user, token: MOCK_TOKEN } };
    },

    async register(data: RegisterData): Promise<ApiResponse<User>> {
      await delay(800);
      if (mockUsers.find((u) => u.email === data.email)) {
        throw { response: { data: { status: 'error', message: 'E-mail já cadastrado' } } };
      }
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name: data.name,
        email: data.email,
        role: 'CLIENT',
        createdAt: new Date().toISOString(),
      };
      return { status: 'success', data: newUser };
    },
  },

  users: {
    async findAll(): Promise<ApiResponse<User[]>> {
      await delay(600);
      return { status: 'success', data: mockUsers };
    },
  },

  appointments: {
    async findAll(): Promise<ApiResponse<Appointment[]>> {
      await delay(600);
      return { status: 'success', data: mockAppointments };
    },

    async create(data: { title: string; description?: string; date: string }): Promise<ApiResponse<Appointment>> {
      await delay(800);
      const newAppointment: Appointment = {
        id: String(mockAppointments.length + 1),
        ...data,
        status: 'PENDING',
        userId: '1',
        user: { id: '1', name: 'João Silva', email: 'joao@email.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockAppointments.push(newAppointment);
      return { status: 'success', data: newAppointment };
    },

    async delete(id: string): Promise<void> {
      await delay(500);
      const index = mockAppointments.findIndex((a) => a.id === id);
      if (index !== -1) mockAppointments.splice(index, 1);
    },
  },
};
