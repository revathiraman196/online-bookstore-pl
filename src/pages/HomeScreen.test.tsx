import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeScreen from './HomeScreen';

describe('HomeScreen component', () => {
  test('renders heading and book cards with Add to Cart buttons', () => {
    render(<HomeScreen />);

    // Check heading
    expect(screen.getByRole('heading', { name: /latestest books/i })).toBeInTheDocument();

    // Check book titles (all 3 books)
    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
    expect(screen.getByText('Book Three')).toBeInTheDocument();

    // Check all "Add to Cart" buttons
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(buttons).toHaveLength(3);
  });
});
