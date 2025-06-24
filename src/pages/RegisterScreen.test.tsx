// __tests__/RegisterScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

import authReducer from '../features/auth/authSlice';
import RegisterScreen from './RegisterScreen';
import axiosInstance from '../services/axiosInstance';

jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

// FIXED: added missing closing bracket and return statement here
const renderWithStore = (preloadedState?: any) => {
  const rootReducer = combineReducers({
    auth: authReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <RegisterScreen />
        </BrowserRouter>
      </Provider>
    ),
  };
};

describe('RegisterScreen (real store)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders registration form', () => {
    renderWithStore();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', () => {
    renderWithStore();

    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', () => {
    renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it('shows validation error for short password', () => {
    renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('registers user successfully', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, username: 'user1', email: 'user1@example.com', token: 'abc123' },
    });

    const { store } = renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user1@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user?.email).toBe('user1@example.com');
    });
  });

  it('shows error alert on API failure', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Registration failed' } },
    });

    const { store } = renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user2@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(store.getState().auth.error).toBe('Registration failed');
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
