import cors from "cors";
import express from "express";
import path from "path";
import "dotenv/config";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import petRouter from "./routes/pet.routes";
import clinicRouter from "./routes/clinic.routes";

import { connectDB } from "./config/database";
import { authenticate, authorize } from "./middlewares/auth.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/errors.middleware"; // ← Importa ambos

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para interpretar JSON
app.use(express.json());

// Habilita todas las peticiones cross-origin
app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas PÚBLICAS
app.use("/api/auth", authRouter); // Registro y login

// Rutas PROTEGIDAS
app.use("/api/users", userRouter); // CRUD de usuarios
app.use("/api/pets", authenticate, authorize(["vet"]), petRouter); // CRUD de mascotas
app.use("/api/clinic", authenticate, authorize(["vet"]), clinicRouter); // CRUD de consultas

// Rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware global de manejo de errores
app.use(errorHandler);

// Conectar a MongoDB y luego iniciar el servidor HTTP
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
	});
});
