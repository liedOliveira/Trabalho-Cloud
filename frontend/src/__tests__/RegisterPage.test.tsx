import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RegisterPage from '../pages/RegisterPage';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithProviders(component: React.ReactElement) {
  return render(
    <AuthProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthProvider>
  );
}

describe('RegisterPage', () => {
  it('deve renderizar o formulário de cadastro', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument();
  });

  it('deve ter um link para a página de login', () => {
    renderWithProviders(<RegisterPage />);

    const link = screen.getByText('Fazer login');
    expect(link).toHaveAttribute('href', '/login');
  });

  it('deve ter todos os campos obrigatórios', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByLabelText('Nome')).toBeRequired();
    expect(screen.getByLabelText('E-mail')).toBeRequired();
    expect(screen.getByLabelText('Senha')).toBeRequired();
  });

  it('deve renderizar os placeholders corretos', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByPlaceholderText('Seu nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument();
  });
});
