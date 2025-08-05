import { Router } from "express";
import userRouter from "./user.routes";
import courseRouter from "./course.routes";
import applicationRouter from "./application.routes";

const router = Router();

// Mount routers
router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/applications", applicationRouter)

export default router;