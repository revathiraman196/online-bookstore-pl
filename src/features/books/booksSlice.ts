// src/features/books/booksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchBooksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure } = booksSlice.actions;

export default booksSlice.reducer;
