export interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
}
export interface UserResponse {
  id: number;
  username: string;
  name: string;
  token: string;  // e.g., JWT token
  // Add any other fields your API returns
}