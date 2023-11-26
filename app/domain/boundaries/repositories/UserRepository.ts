import { User } from "~/domain/entities/User";

export type UserRepository = {
  getByEmail: (email: string) => Promise<User | null>;
  getByUsername: (username: string) => Promise<User | null>;
  getById: (id: string) => Promise<User | null>;
  save: (user: User) => Promise<void>;
  delete: (user: User) => Promise<void>;
};
