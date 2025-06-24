import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import booksReducer from '../features/books/booksSlice';
import cartReducer from '../features/cart/cartSlice';
import { loggingMiddleware } from './loggingMiddleware';

export const store = configureStore({
  reducer: {
   books: booksReducer,
   cart: cartReducer,
   auth:authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;