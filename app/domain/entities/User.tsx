export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string | null;
  authMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
