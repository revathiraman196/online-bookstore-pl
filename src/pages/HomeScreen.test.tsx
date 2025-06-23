// HomeScreen.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomeScreen from './HomeScreen';
import { Provider } from 'react-redux';
import { store } from '../app/store';  // real store
import axiosInstance from '../services/axiosInstance';

jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

describe('HomeScreen', () => {
  const mockBooks = [
    { id: 1, name: 'Book One', author: 'Author One', price: 10 },
    { id: 2, name: 'Book Two', author: 'Author Two', price: 20 },
  ];

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
});
