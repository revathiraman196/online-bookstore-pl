// App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  test('renders the login page by default', () => {
    render(<App />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
