// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import * as api from './services/booksApi';

jest.mock('./services/booksApi');

test('renders books after fetch', async () => {
  (api.fetchBooksApi as jest.Mock).mockResolvedValue([
    { id: 1, title: 'Book1', author: 'Author 1', price: 12.9 },
  ]);

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Wait for the book to appear
  expect(await screen.findByText(/Book1/i)).toBeInTheDocument();
});
