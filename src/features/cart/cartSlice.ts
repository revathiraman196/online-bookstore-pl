import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addToCartAsync, CartItem , updateCartQuantityAsync} from './cartThunks';

export interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // New reducer for removing an item by bookId
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.bookId !== action.payload);
    } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.status = 'succeeded';
        const existing = state.items.find(item => item.bookId === action.payload.bookId);
        if (existing) {
          existing.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Failed to add to cart';
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        const item = state.items.find(i => i.bookId === action.payload.bookId);
        if (item) {
            item.quantity = action.payload.quantity;
        }
     });
  },
});
// Export the new action so you can dispatch it
export const { removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
