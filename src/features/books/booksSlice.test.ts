import booksReducer, { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, Book } from './booksSlice';

describe('booksSlice reducer', () => {
  const initialState = {
    books: [],
    loading: false,
    error: null,
  };

  it('should handle fetchBooksStart', () => {
    const action = fetchBooksStart();
    const state = booksReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchBooksSuccess', () => {
    const mockBooks: Book[] = [
      { id: 1, name: 'Book One', author: 'Author A', price: 10 },
    ];
    const action = fetchBooksSuccess(mockBooks);
    const state = booksReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.books).toEqual(mockBooks);
  });

  it('should handle fetchBooksFailure', () => {
    const action = fetchBooksFailure('Error occurred');
    const state = booksReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error occurred');
  });
});