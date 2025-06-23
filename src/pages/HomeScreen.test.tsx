// src/pages/HomeScreen.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomeScreen from './HomeScreen';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit'; 
import cartReducer from '../features/cart/cartSlice';
import booksReducer from '../features/books/booksSlice';
import axiosInstance from '../services/axiosInstance';

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

// ✅ Helper to create a test store with optional preloaded state
const renderWithStore = (preloadedState?: any) => {
  const rootReducer = combineReducers({
    cart: cartReducer,
    books: booksReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
};

describe('HomeScreen', () => {
  const mockBooks = [
    { id: 1, title: 'Book One', author: 'Author One', price: 10 },
    { id: 2, title: 'Book Two', author: 'Author Two', price: 20 },
  ];

  beforeEach(() => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockBooks });
  });

  it('renders book list after fetch', async () => {
    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });
  });

  it('shows error if fetch fails', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithStore();

    expect(await screen.findByRole('alert')).toHaveTextContent('Network error');
  });

  it('disables Add to Cart button while loading', async () => {
    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /add book one to cart/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/adding/i);
    });
  });

  it('shows cart error message if adding to cart fails', async () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'failed',
        error: 'Failed to add to cart',
      },
      books: {
        books: [{ id: 1, title: 'Book One', author: 'Author One', price: 10 }],
        loading: false,
        error: null,
      },
    });

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to add to cart');
  });
});
