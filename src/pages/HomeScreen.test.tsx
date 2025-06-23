import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomeScreen from './HomeScreen';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockBooks = [
  { id: 1, name: 'Book One', author: 'Author A', price: 15.99 },
  { id: 2, name: 'Book Two', author: 'Author B', price: 12.49 },
];

describe('BookList component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockBooks });
  });

  test('renders loading spinner and then book list', async () => {
    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    // Loading spinner shows initially
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

    // Wait for books to appear
    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });

    // Buttons present
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(buttons.length).toBe(mockBooks.length);
  });

  test('renders error message on API failure', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
    });
  });
});