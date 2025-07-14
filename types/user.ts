export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface UpdateUser {
  username: string;
  avatar?: string;
}

export interface LogInUser extends UserResponse {
  accessToken: string;
  refreshToken: string;
}
