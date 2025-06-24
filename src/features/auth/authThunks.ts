import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { UserResponse } from './types';


interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}


export const loginUser = createAsyncThunk<
  UserResponse,            // Return type on success
  LoginRequest,            // Argument type
  { rejectValue: string }  // Reject type
>(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post<UserResponse>('/auth/login', { username, password });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Network error: Unable to login';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk<
  UserResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });

      return response.data as UserResponse;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
