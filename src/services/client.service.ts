import { Client, ClientData } from "../models/clients.model";

// Encontrar todos los dueños
export const findAllClients = async (): Promise<ClientData[] | null> => {
	const client = await Client.find().lean();
	if (!client) return null;

	return client.map((client) => ({
		id: client._id.toString(),
		name: client.name,
		email: client.email,
		phone: client.phone,
	}));
};

// Encontrar cliente por nombre o email
export const findClientByNameOrEmail = async (
	name: string = "",
	email: string = "",
): Promise<ClientData | null> => {
	const client = await Client.findOne({ $or: [{ email }, { name }] }).lean();
	if (!client) return null;

	return {
		id: client._id.toString(),
		name: client.name,
		email: client.email,
		phone: client.phone,
	};
};

// Encontrar dueño por ID
export const findClientById = async (
	id: string,
): Promise<ClientData | null> => {
	const client = await Client.findById(id).lean();
	if (!client) return null;

	return {
		id: client._id.toString(),
		name: client.name,
		email: client.email,
		phone: client.phone,
	};
};

// Crear dueño
export const createClient = async (
	client: Omit<ClientData, "id">,
): Promise<ClientData> => {
	const newClient = new Client({
		name: client.name,
		email: client.email,
		phone: client.phone,
	});
	return await newClient.save();
};

// Actualizar dueño
export const updateClient = async (
	id: string,
	updates: Partial<Omit<ClientData, "id">>,
): Promise<ClientData | null> => {
	const client = await Client.findById(id);
	if (!client) return null;

	// Actualizar campos permitidos
	if (updates.name) client.name = updates.name;
	if (updates.email) client.email = updates.email;
	if (updates.phone) client.phone = updates.phone;

	await client.save();

	return {
		id: client._id.toString(),
		name: client.name,
		email: client.email,
		phone: client.phone,
	};
};

// Eliminar dueño
export const deleteClient = async (id: string): Promise<boolean> => {
	const result = await Client.findByIdAndDelete(id);
	// !!result devuelve TRUE si lo encuentra y borra
	// !!result devuelve FALSE si no lo encuentra
	return !!result;
};
