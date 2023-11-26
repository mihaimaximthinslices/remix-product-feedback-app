import { UserRepository } from "~/domain/boundaries/repositories/UserRepository";

import { User } from "~/domain/entities/User";

import prisma from "~/infrastructure/prisma/dbConn";

export const userRepository: UserRepository = {
  async getByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  },

  async getByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    return user;
  },

  async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    return user;
  },

  async save(user: User): Promise<void> {
    const { id, ...userData } = user;

    // Use upsert to insert or update the user based on their ID
    await prisma.user.upsert({
      where: { id },
      update: userData,
      create: {
        id,
        ...userData,
      },
    });
  },

  async delete(user: User): Promise<void> {
    const { id } = user;
    await prisma.user.delete({
      where: { id },
    });
  },
};
