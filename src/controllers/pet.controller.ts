import { Request, Response } from "express";
import * as petService from "../services/pet.service";

// findAllPets
export const findAllPets = async (req: Request, res: Response) => {
	try {
		const pets = await petService.findAllPets();
		if (!pets) {
			return res
				.status(404)
				.json({ error: "No se encontraron mascotas" });
		}

		return res.status(200).json(pets);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener las mascotas" });
	}
};

// findPetById
export const findPetById = async (req: Request, res: Response) => {
	const id = req.params.id as string;

	try {
		const pet = await petService.findPetById(id);
		if (!pet) {
			return res.status(404).json({ error: "Mascota no encontrada" });
		}
		return res.status(200).json(pet);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener la mascota" });
	}
};

// createPet
export const createPet = async (req: Request, res: Response) => {
	try {
		const { name, species, ownerId } = req.body;
		const vetId = req.user!.id;
		const pet = await petService.createPet({
			name,
			species,
			ownerId,
			vetId,
		});

		return res
			.status(201)
			.json({ pet, message: "Mascota creada exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al crear la mascota" });
	}
};

// updatePet
export const updatePet = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const updates = req.body;

		// Check ownership
		const existingPet = await petService.findPetById(id);
		if (!existingPet) {
			return res.status(404).json({ error: "Mascota no encontrada" });
		}
		if (existingPet.vetId !== req.user!.id) {
			return res
				.status(403)
				.json({
					error: "Acceso denegado: mascota no pertenece al veterinario",
				});
		}

		const updatedPet = await petService.updatePet(id, updates);
		if (!updatedPet) {
			return res.status(404).json({ error: "Mascota no encontrada" });
		}

		return res
			.status(200)
			.json({ updatedPet, message: "Mascota actualizada exitosamente" });
	} catch (error) {
		res.status(500).json({ error: "Error al actualizar la mascota" });
	}
};

// deletePet
export const deletePet = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const deletedPet = await petService.deletePet(id);

		if (!deletedPet) {
			res.status(404).json({ error: "Mascota no encontrada" });
		}

		res.status(200).json({ message: "Mascota eliminada exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al eliminar la mascota" });
	}
};
