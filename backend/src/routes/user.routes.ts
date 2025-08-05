import { Router } from "express";
import { UserController } from "../controller/UserController";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/login", async (req, res) => {
  await userController.login(req, res);
});

userRouter.post("/signup", async (req, res) => {
  await userController.signUp(req, res);
});

userRouter.get("/:id", async (req, res) => {
  await userController.getUserByIdWithSkills(req, res);
});

export default userRouter;