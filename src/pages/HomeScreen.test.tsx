import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomeScreen from './HomeScreen';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import axiosInstance from '../services/axiosInstance';
import * as cartThunks from '../features/cart/cartThunks';
import { configureStore } from '@reduxjs/toolkit'; 
import cartReducer from '../features/cart/cartSlice';
import booksReducer from '../features/books/booksSlice'

// Suppress console.error during tests to avoid noise
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

// Mock axiosInstance globally
jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

describe('HomeScreen', () => {
  const mockBooks = [
    { id: 1, name: 'Book One', author: 'Author One', price: 10 },
    { id: 2, name: 'Book Two', author: 'Author Two', price: 20 },
  ];
  // Create a test store with error state preset
  const renderWithStore = (preloadedState: any) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      books: booksReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
};


  beforeEach(() => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockBooks });
  });

  it('renders book list after fetch', async () => {
    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });
  });

  it('shows error if fetch fails', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('disables Add to Cart button while loading', async () => {
    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

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

 
test('shows cart error message if adding to cart fails', async () => {
  renderWithStore({
    cart: {
      items: [],
      status: 'failed',
      error: 'Failed to add to cart',
    },
    books: {
      books: [
        { id: 1, name: 'Book One', author: 'Author One', price: 10 }
      ],
      loading: false,
      error: null,
    },
  });

  // Assert that the alert is shown with correct error
  expect(await screen.findByRole('alert')).toHaveTextContent('Failed to add to cart');
});

});
