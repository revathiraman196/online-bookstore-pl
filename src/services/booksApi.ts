import axios from 'axios';
import { Book } from '../features/books/booksSlice';
import axiosInstance from './axiosInstance';

export const fetchBooksApi = async (): Promise<Book[]> => {
  try {
    const response = await axiosInstance.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};
