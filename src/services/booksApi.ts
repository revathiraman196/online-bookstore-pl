import axios from 'axios';
import { Book } from '../features/books/booksSlice';

const API_URL = 'http://localhost:8081/api/v1/books'; // ✅ Correct URL

const username = 'katatest';
const password = 'katatest@123';

// Base64-encode the username and password
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

export const fetchBooksApi = async (): Promise<Book[]> => {
  try {
    const response = await axios.get<Book[]>(API_URL, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};
