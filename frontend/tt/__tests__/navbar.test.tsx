import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '@/components/shared/navbar';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return { push: jest.fn() };
  },
}));

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows Login button when user is not logged in', () => {
    render(<Navbar />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('shows Logout button when user is logged in', () => {
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<Navbar />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

});