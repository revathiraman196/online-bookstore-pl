// src/features/cart/cartSlice.test.ts
import reducer, { CartState } from './cartSlice';
import { addToCartAsync, CartItem } from './cartThunks';

describe('cartSlice reducer', () => {
  const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToCartAsync.pending', () => {
    const action = { type: addToCartAsync.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      items: [],
      status: 'loading',
      error: null,
    });
  });

  it('should handle addToCartAsync.fulfilled when cart is empty', () => {
    const newItem: CartItem = { bookId: 1, quantity: 2 };
    const action = { type: addToCartAsync.fulfilled.type, payload: newItem };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      items: [newItem],
      status: 'succeeded',
      error: null,
    });
  });

  it('should handle addToCartAsync.fulfilled when item exists', () => {
    const existingItem: CartItem = { bookId: 1, quantity: 2 };
    const stateWithItem: CartState = {
      items: [existingItem],
      status: 'idle',
      error: null,
    };
    const action = { type: addToCartAsync.fulfilled.type, payload: { bookId: 1, quantity: 3 } };
    const state = reducer(stateWithItem, action);

    expect(state.items.length).toBe(1);
    expect(state.items[0]).toEqual({ bookId: 1, quantity: 5 });
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });

  it('should handle addToCartAsync.rejected with payload error', () => {
    const action = {
      type: addToCartAsync.rejected.type,
      payload: 'Network Error',
      error: { message: 'Rejected' },
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network Error');
  });

  it('should handle addToCartAsync.rejected without payload', () => {
    const action = {
      type: addToCartAsync.rejected.type,
      error: { message: 'Rejected' },
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to add to cart');
  });
});
