// src/controllers/AuthController.ts
import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";

import { UserService } from "../services/UserController";
import { AuthenticationService } from "../services/AuthController";

export async function registerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { username, password } = req.body;

  const userService = Container.get(UserService);

  try {
    const user = await userService.createUser(username, password);
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    if (error.hasOwnProperty("code") && error.code == "ER_DUP_ENTRY") {
      // Handle the duplicate error

      res.status(500).json({
        error: "Username already exists. Please enter a different username.",
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to register user, please try again." });
    }
  }
}

export async function loginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { username, password } = req.body;

  const userService = Container.get(UserService);
  const authService = Container.get(AuthenticationService);

  try {
    const user = await userService.getUserByUsername(username);

    if (user && (await userService.comparePasswords(password, user.password))) {
      const token = authService.generateToken(user.id);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid login credentials" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to log in, please try again." });
  }
}
