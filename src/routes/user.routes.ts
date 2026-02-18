import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.findAllUsers);
router.get("/:id", userController.findUserById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
