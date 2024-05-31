import { Router } from "express";
import {
  loginMiddleware,
  registerMiddleware,
} from "./middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", registerMiddleware);
authRouter.post("/login", loginMiddleware);
export default authRouter;
