// src/services/UserService.ts
import { Service } from "typedi";
import { hash, compare } from "bcryptjs";

import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

@Service()
export class UserService {
  appDataSource = AppDataSource;
  async createUser(username: string, password: string): Promise<User> {
    try {
      // Hash the password
      const hashedPassword = await hash(password, 10);

      const reg = await this.appDataSource.manager.save(
        this.appDataSource.manager.create(User, {
          username,
          password: hashedPassword,
        })
      );

      return { ...reg, password: null };
    } catch (error) {
      throw error; // Rethrow other errors
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.appDataSource.manager.findOne(User, {
      where: { username },
    });
    return user;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
