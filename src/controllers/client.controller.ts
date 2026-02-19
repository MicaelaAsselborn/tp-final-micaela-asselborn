import { Request, Response } from "express";
import * as clientService from "../services/client.service";

export const findAllClients = async (req: Request, res: Response) => {
	try {
		const clients = await clientService.findAllClients();
		if (!clients) {
			return res.status(404).json({ error: "No se encontraron dueños" });
		}

		return res.status(200).json(clients);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener los dueños" });
	}
};

export const findClientByNameOrEmail = async (req: Request, res: Response) => {
	try {
		const { name = "", email = "" } = req.query;
		// Asegurarse de que al menos uno esté presente
		if (!name && !email) {
			return res
				.status(400)
				.json({ error: "Debe proporcionar nombre o email" });
		}
		const client = await clientService.findClientByNameOrEmail(
			String(name),
			String(email),
		);
		if (!client) {
			return res.status(404).json({ error: "Dueño no encontrado" });
		}
		return res.status(200).json(client);
	} catch (error) {
		return res.status(500).json({ error: "Error al buscar el dueño" });
	}
};

export const findClientById = async (req: Request, res: Response) => {
	const id = req.params.id as string;

	try {
		const client = await clientService.findClientById(id);
		if (!client) {
			return res.status(404).json({ error: "Dueño no encontrado" });
		}
		return res.status(200).json(client);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener el dueño" });
	}
};

export const createClient = async (req: Request, res: Response) => {
	try {
		const { name, email, phone } = req.body;
		const client = await clientService.createClient({
			name,
			email,
			phone,
		});

		return res
			.status(201)
			.json({ client, message: "Dueño creado exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al crear el dueño" });
	}
};

export const updateClient = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const updates = req.body;

		const existingClient = await clientService.findClientById(id);
		if (!existingClient) {
			return res.status(404).json({ error: "Dueño no encontrado" });
		}

		const updatedClient = await clientService.updateClient(id, updates);
		if (!updatedClient) {
			return res.status(404).json({ error: "Dueño no encontrado" });
		}

		return res.status(200).json({
			updatedClient,
			message: "Dueño actualizado exitosamente",
		});
	} catch (error) {
		res.status(500).json({ error: "Error al actualizar el dueño" });
	}
};

export const deleteClient = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const deletedClient = await clientService.deleteClient(id);

		if (!deletedClient) {
			res.status(404).json({ error: "Dueño no encontrado" });
		}

		res.status(200).json({ message: "Dueño eliminado exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al eliminar el dueño" });
	}
};
