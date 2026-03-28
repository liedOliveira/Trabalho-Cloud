import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithProviders(component: React.ReactElement) {
  return render(
    <AuthProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthProvider>
  );
}

describe('LoginPage', () => {
  it('deve renderizar o formulário de login corretamente', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('AgendaPro')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('deve ter um link para a página de cadastro', () => {
    renderWithProviders(<LoginPage />);

    const link = screen.getByText('Cadastre-se');
    expect(link).toHaveAttribute('href', '/register');
  });

  it('deve ter campos obrigatórios', () => {
    renderWithProviders(<LoginPage />);

    const emailField = screen.getByLabelText('E-mail');
    const passwordField = screen.getByLabelText('Senha');

    expect(emailField).toBeRequired();
    expect(passwordField).toBeRequired();
  });

  it('deve ter placeholders corretos', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
  });

  it('deve renderizar a subtítulo de boas-vindas', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument();
  });
});
