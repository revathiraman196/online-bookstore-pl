// src/services/booksApi.test.ts
import axios from 'axios';
import { fetchBooksApi } from './booksApi';
import { Book } from '../features/books/booksSlice';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchBooksApi', () => {
  const mockBooks: Book[] = [
    { id: 1, name: 'Test Book 1', author: 'Author 1' , price:12.9},
    { id: 2, name: 'Test Book 2', author: 'Author 2' , price:12.9},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches books successfully with authorization header', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBooks });

    const books = await fetchBooksApi();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8081/api/v1/books', {
      headers: {
        Authorization: expect.stringContaining('Basic '),
      },
    });

    expect(books).toEqual(mockBooks);
  });

  it('throws an error when the network request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchBooksApi()).rejects.toThrow('Network Error');
  });
});
