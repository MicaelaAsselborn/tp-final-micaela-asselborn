import { Request, Response } from "express";
import * as clinicService from "../services/clinic.service";

// findAllConsults
export const findAllConsults = async (req: Request, res: Response) => {
	try {
		const consults = await clinicService.findAllConsults();

		if (!consults) {
			res.status(404).json({ error: "No se encontraron consultas" });
		}

		res.status(200).json(consults);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener consultas" });
	}
};

// findConsultsById
export const findConsultById = async (req: Request, res: Response) => {
	const id = req.params.id as string;

	try {
		const consult = await clinicService.findConsultById(id);

		if (!consult) {
			return res.status(404).json({
				error: "No se encontró la consulta con ese ID",
			});
		}

		if (consult.vetId !== req.user!.id) {
			return res
				.status(403)
				.json({
					error: "Acceso denegado: consulta no pertenece al veterinario",
				});
		}

		res.status(200).json(consult);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener consulta" });
	}
};

// createConsult
export const createConsult = async (req: Request, res: Response) => {
	try {
		const { petId, consult, treatment } = req.body;
		const vetId = req.user!.id;

		const clinicConsult = clinicService.createConsult({
			petId,
			vetId,
			consult,
			treatment,
		});

		return res
			.status(201)
			.json({ clinicConsult, message: "Consulta creada exitosamente" });
	} catch (error) {
		res.status(500).json({ error: "Error al crear consulta" });
	}
};

// updateConsult
export const updateConsult = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const updates = req.body;

		// Check ownership
		const existingConsult = await clinicService.findConsultById(id);
		if (!existingConsult) {
			return res.status(404).json({ error: "Consulta no encontrada" });
		}
		if (existingConsult.vetId !== req.user!.id) {
			return res
				.status(403)
				.json({
					error: "Acceso denegado: consulta no pertenece al veterinario",
				});
		}

		const updatedConsult = await clinicService.updateConsult(id, updates);
		if (!updatedConsult) {
			return res.status(404).json({ error: "Consulta no encontrada" });
		}

		return res.status(200).json({
			updatedConsult,
			message: "Consulta actualizada exitosamente",
		});
	} catch (error) {
		res.status(500).json({ error: "Error al actualizar la consulta" });
	}
};

// deleteConsult
export const deleteConsult = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;

		// Check ownership
		const existingConsult = await clinicService.findConsultById(id);
		if (!existingConsult) {
			return res.status(404).json({ error: "Consulta no encontrada" });
		}
		if (existingConsult.vetId !== req.user!.id) {
			return res
				.status(403)
				.json({
					error: "Acceso denegado: consulta no pertenece al veterinario",
				});
		}

		const deletedConsult = await clinicService.deleteConsult(id);
		if (!deletedConsult) {
			return res.status(404).json({ error: "Consulta no encontrada" });
		}

		return res
			.status(200)
			.json({ message: "Consulta eliminada exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al eliminar la consulta" });
	}
};
