import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './header';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../features/cart/cartSlice';
import booksReducer from '../features/books/booksSlice';
import axiosInstance from '../services/axiosInstance';
import authReducer from '../features/auth/authSlice';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Suppress console.error during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

// ✅ Mock axiosInstance globally
jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

const renderWithStore = (preloadedState?: any) => {
  const rootReducer = combineReducers({
    cart: cartReducer,
    books: booksReducer,
    auth: authReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar with cart button and 0 items', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
      books: {
        books: [
          { id: 1, title: 'Domain-Driven Design', author: 'Eric Evans', price: 39.99 },
        ],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText(/bookstore/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cart/i })).toHaveTextContent('Cart (0)');
  });

  it('displays the correct total quantity in cart', () => {
    renderWithStore({
      cart: {
        items: [
          { bookId: 1, quantity: 2 },
          { bookId: 2, quantity: 3 },
        ],
        status: 'idle',
        error: null,
      },
      books: {
        books: [
          { id: 1, title: 'Clean Architecture', author: 'Robert C. Martin', price: 34.99 },
        ],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: true,
        user: null,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByRole('button', { name: /cart/i })).toHaveTextContent('Cart (5)');
  });

  it('opens cart offcanvas when cart button is clicked', () => {
    renderWithStore({
      cart: {
        items: [{ bookId: 1, quantity: 2 }],
        status: 'idle',
        error: null,
      },
      books: {
        books: [
          { id: 1, title: 'Clean Architecture', author: 'Robert C. Martin', price: 34.99 },
        ],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      },
    });

    const cartButton = screen.getByRole('button', { name: /cart/i });
    fireEvent.click(cartButton);

    expect(screen.getByText(/your cart/i)).toBeInTheDocument();
    expect(screen.getByText(/author: robert c. martin/i)).toBeInTheDocument();
  });

  it('shows "Your cart is empty" when no items are in the cart', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
      books: {
        books: [
          { id: 1, title: 'Clean Architecture', author: 'Robert C. Martin', price: 34.99 },
        ],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /cart/i }));

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('shows "Sign In" link when user is not authenticated', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
      books: {
        books: [],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('shows welcome message and logout button when authenticated', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
      books: {
        books: [],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: true,
        user: { username: 'johndoe' },
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText(/welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/johndoe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout and navigates to homescreen when logout clicked', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
      books: {
        books: [],
        loading: false,
        error: null,
      },
      auth: {
        isAuthenticated: true,
        user: { username: 'johndoe' },
        loading: false,
        error: null,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/homescreen');
  });
});
