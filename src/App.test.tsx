// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {store} from './app/store';  // adjust path if needed
import App from './App';
import * as api from './services/booksApi';

jest.mock('./services/booksApi');

test('renders books after fetch', async () => {
  (api.fetchBooksApi as jest.Mock).mockResolvedValue([
    { id: 1, name: 'Mock Book', author: 'Author 1', price: 12.9 },
  ]);

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Wait for async render update
  const bookElement = await screen.findByText(/Mock Book/i);
  expect(bookElement).toBeInTheDocument();
});