import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { removeFromCart } from './cartSlice';

export interface CartItem {
  bookId: number;
  quantity: number;
}

export const addToCartAsync = createAsyncThunk<
  CartItem,
  { bookId: number; quantity: number },
  { rejectValue: string }
>(
  'cart/addToCart',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/cart/add', null, {
        params: { bookId, quantity },
      });
      return { bookId, quantity };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCartItemAsync = createAsyncThunk(
  'cart/deleteCartItem',
  async (bookId: number, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cart/items/${bookId}`);
      dispatch(removeFromCart(bookId));  
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
