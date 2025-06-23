import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

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
