export enum UserRole {
  STAFF = 'staff',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}
