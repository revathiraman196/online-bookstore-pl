// src/services/booksApi.test.ts
import { fetchBooksApi } from './booksApi';
import axiosInstance from './axiosInstance';
import { Book } from '../features/books/booksSlice';

jest.mock('./axiosInstance');

describe('fetchBooksApi', () => {
  const mockBooks: Book[] = [
    { id: 1, title: 'Book One', author: 'Author One', price: 10 },
    { id: 2, title: 'Book Two', author: 'Author Two', price: 15 },
  ];

  it('fetches books successfully', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockBooks });

    const result = await fetchBooksApi();
    expect(result).toEqual(mockBooks);
    expect(axiosInstance.get).toHaveBeenCalledWith('/books');
  });

  it('throws error when fetch fails', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchBooksApi()).rejects.toThrow('Network error');
  });
});
