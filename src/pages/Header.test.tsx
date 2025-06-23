// src/components/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import { CartState } from '../features/cart/cartSlice';

const renderWithStore = (preloadedState: { cart: CartState }) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Header />
    </Provider>
  );
};

describe('Header', () => {
  it('renders navbar with cart button and 0 items', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
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
    });

    const cartButton = screen.getByRole('button', { name: /cart/i });
    fireEvent.click(cartButton);

    expect(screen.getByText(/your cart/i)).toBeInTheDocument();
    expect(screen.getByText(/book id: 1/i)).toBeInTheDocument();
  });

  it('shows "Your cart is empty" when no items are in the cart', () => {
    renderWithStore({
      cart: {
        items: [],
        status: 'idle',
        error: null,
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /cart/i }));

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
