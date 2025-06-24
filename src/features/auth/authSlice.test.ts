// __tests__/authSlice.test.ts
import authReducer, { logout } from './authSlice';
import { loginUser, registerUser } from './authThunks';
import { AuthState, UserResponse } from './types';

describe('authSlice reducer', () => {
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  };

  const mockUser: UserResponse = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    token: 'token123',
  };

  it('should return the initial state when passed an empty action', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const prevState: AuthState = {
      isAuthenticated: true,
      user: mockUser,
      loading: false,
      error: 'some error',
    };

    const nextState = authReducer(prevState, logout());

    expect(nextState).toEqual(initialState);
  });

  // loginUser.pending
  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  // loginUser.fulfilled
  it('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      isAuthenticated: true,
      user: mockUser,
    });
  });

  // loginUser.rejected
  it('should handle loginUser.rejected with payload error', () => {
    const action = { type: loginUser.rejected.type, payload: 'Login failed' };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Login failed',
    });
  });

  it('should handle loginUser.rejected without payload', () => {
    const action = { type: loginUser.rejected.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Login failed',
    });
  });

  // registerUser.pending
  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  // registerUser.fulfilled
  it('should handle registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      isAuthenticated: true,
      user: mockUser,
    });
  });

  // registerUser.rejected
  it('should handle registerUser.rejected with payload error', () => {
    const action = { type: registerUser.rejected.type, payload: 'Failed to register' };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Failed to register',
    });
  });

  it('should handle registerUser.rejected without payload', () => {
    const action = { type: registerUser.rejected.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Failed to register',
    });
  });
});
