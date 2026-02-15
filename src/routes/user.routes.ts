import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", userController.findAllUsers);
router.get("/:id", userController.findUserById);
router.post("/", authenticate, authorize(["admin"]), userController.createUser);
router.patch(
	"/:id",
	authenticate,
	authorize(["admin"]),
	userController.updateUser,
);
router.delete(
	"/:id",
	authenticate,
	authorize(["admin"]),
	userController.deleteUser,
);

export default router;
