export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}
