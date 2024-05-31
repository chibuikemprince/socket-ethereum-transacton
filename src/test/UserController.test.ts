import { UserService } from "../services/UserController";

import { hash } from "bcryptjs";

jest.mock("bcryptjs", () => ({
  hash: jest.fn((a) => {
    return a;
  }),
  compare: jest.fn((a, b) => {
    return a == b;
  }),
}));

console.log = jest.fn();
describe("UserService", () => {
  let userService: UserService;
  const mockUser = {
    username: "testuser",
    password: "testpassword",
  };

  beforeEach(() => {
    userService = new UserService();
    // Mock the save method of AppDataSource.manager

    userService.appDataSource.manager.save = jest
      .fn()
      .mockResolvedValue(mockUser);
    // Mock the findOne method of AppDataSource.manager
    userService.appDataSource.manager.findOne = jest
      .fn()
      .mockResolvedValue(mockUser);

    userService.appDataSource.manager.create = jest
      .fn()
      .mockResolvedValue(mockUser);
  });

  describe("createUser", () => {
    it("should create a user with hashed password", async () => {
      const result = await userService.createUser(
        mockUser.username,
        mockUser.password
      );
      expect(result.username).toBe(mockUser.username);
      expect(result.password).toBe(null);

      // Verify that the password was hashed
      expect(hash).toHaveBeenCalledWith(mockUser.password, 10);
    });

    it("should throw an error if save fails", async () => {
      userService.appDataSource.manager.save = jest
        .fn()
        .mockRejectedValue(new Error("Save failed"));

      await expect(
        userService.createUser(mockUser.username, mockUser.password)
      ).rejects.toThrow(Error);
    });
  });

  describe("getUserByUsername", () => {
    it("should return a user by username", async () => {
      const result = await userService.getUserByUsername(mockUser.username);
      expect(result).toEqual(mockUser);
    });
  });

  describe("comparePasswords", () => {
    it("should return true if passwords match", async () => {
      const hashedPassword = await hash(mockUser.password, 10);
      const result = await userService.comparePasswords(
        mockUser.password,
        hashedPassword
      );
      expect(result).toBe(true);
    });

    it("should return false if passwords don't match", async () => {
      const result = await userService.comparePasswords(
        mockUser.password,
        "incorrecthashedpassword"
      );
      expect(result).toBe(false);
    });
  });
});
