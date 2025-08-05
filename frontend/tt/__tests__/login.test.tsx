import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/pages/login';

// Mock the users module with dummy users.
jest.mock('@/users/users', () => ({
  users: [
    { id: '1', email: 'test@example.com', role: 'Lecturer', name: 'Test Lecturer', password: 'password' },
    { id: '2', email: 'test3@example.com', role: 'Candidate', name: 'Test Candidate', password: 'password' },
  ],
}));

// Override window.location.href to capture redirection.
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { href: '' },
});

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login page with Lecturer Sign In by default', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Lecturer Sign In/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  test('displays helper text error when invalid email is entered', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  test('login button is disabled when email is invalid or password is empty', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /Log In/i });
    // Initially, email is empty so button should be disabled.
    expect(loginButton).toBeDisabled();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    expect(loginButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(loginButton).not.toBeDisabled();
  });

  test('toggles role when clicking toggle buttons', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Lecturer Sign In/i)).toBeInTheDocument();

    const candidateButton = screen.getByRole('button', { name: /Candidate/i });
    fireEvent.click(candidateButton);
    expect(screen.getByText(/Candidate Sign In/i)).toBeInTheDocument();
  });
});