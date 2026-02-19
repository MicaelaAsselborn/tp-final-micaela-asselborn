import { Router } from "express";
import * as clientController from "../controllers/client.controller";

const router = Router();

router.get("/", clientController.findAllClients);
router.get("/search", clientController.findClientByNameOrEmail);
router.get("/:id", clientController.findClientById);
router.post("/", clientController.createClient);
router.patch("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

export default router;
