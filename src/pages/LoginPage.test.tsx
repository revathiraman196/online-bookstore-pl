// __tests__/LoginScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

import authReducer from '../features/auth/authSlice';
import LoginScreen from './LoginPage'; // adjust path if needed
import axiosInstance from '../services/axiosInstance';

// Mock only the API, not the thunk
jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

// Reusable render helper
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
          <LoginScreen />
        </BrowserRouter>
      </Provider>
    ),
  };
};

// ✅ Tests
describe('LoginScreen with real Redux store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    renderWithStore();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('logs in successfully and updates store', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        token: 'fake-token',
      },
    });

    const { store } = renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.user?.username).toBe('testuser');
    });
  });

  it('shows error message if login fails', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid credentials' },
      },
    });

    const { store } = renderWithStore();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.error).toBe('Invalid credentials');
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
