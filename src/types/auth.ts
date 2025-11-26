export type User = {
  id: string;
  username: string;
  role: string;
  email?: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  userId: string;
  User: string;
  Role: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};