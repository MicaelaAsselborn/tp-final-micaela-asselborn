import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

/**
 * Middleware para manejar rutas no encontradas (404).
 * Este middleware se debe colocar DESPUÉS de todas las rutas definidas
 * pero ANTES del errorHandler.
 */
export const notFoundHandler = (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
	});
};

/**
 * Middleware global para el manejo de errores en la aplicación.
 * Este middleware captura errores que ocurren en rutas o middlewares anteriores
 * y envía una respuesta adecuada al cliente.
 *
 * @param err - El objeto de error que se ha producido
 * @param req - El objeto de solicitud HTTP
 * @param res - El objeto de respuesta HTTP
 * @param next - La función next para pasar el control al siguiente middleware
 */
export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction, // ← Usa el tipo correcto, aunque no lo uses
) => {
	// Log del error para depuración en el servidor
	console.error("Error capturado:", err);

	// Si ya se envió una respuesta (headers fueron enviados), pasar al siguiente middleware
	if (res.headersSent) {
		return next(err);
	}

	// Determinar el código de estado HTTP basado en el tipo de error
	let statusCode = err.statusCode || 500;
	let message = err.message || "Algo salió mal";

	// Manejar errores específicos de MongoDB (duplicados)
	if (err.code === 11000) {
		statusCode = 409; // Conflict
		const field = Object.keys(err.keyValue || {})[0] || "campo";
		message = `El ${field} ya existe en el sistema`;
	}

	// Manejar errores de validación de Mongoose
	if (err instanceof mongoose.Error.ValidationError) {
		statusCode = 400;
		const messages = Object.values(err.errors).map((e: any) => e.message);
		message = messages.length > 0 ? messages[0] : "Error de validación";
	}

	// Manejar errores de CastError (ID de MongoDB inválido)
	if (err instanceof mongoose.Error.CastError) {
		statusCode = 400;
		message = `ID inválido: ${err.value}`;
	}

	// Enviar la respuesta de error al cliente en formato JSON
	res.status(statusCode).json({
		success: false,
		message: message,
		// Solo incluir stack trace en desarrollo
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
