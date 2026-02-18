import { ClinicData, Consult } from "../models/clinic.model";

// Encontrar todas las consultas de un veterinario
export const findAllConsults = async (): Promise<ClinicData[] | null> => {
	const consults = await Consult.find().lean();

	if (!consults) return null;

	return consults.map((consult) => ({
		id: consult._id.toString(),
		petId: consult.petId,
		vetId: consult.vetId,
		consult: consult.consult,
		treatment: consult.treatment,
	}));
};

// Encontrar consulta por ID
export const findConsultById = async (
	id: string,
): Promise<ClinicData | null> => {
	const consult = await Consult.findById(id).lean();
	if (!consult) return null;

	return {
		id: consult._id.toString(),
		petId: consult.petId,
		vetId: consult.vetId,
		consult: consult.consult,
		treatment: consult.treatment,
	};
};

// Crear consulta
export const createConsult = async (
	consult: Omit<ClinicData, "id">,
): Promise<ClinicData> => {
	const newConsult = new Consult({
		petId: consult.petId,
		vetId: consult.vetId,
		consult: consult.consult,
		treatment: consult.treatment,
	});
	return await newConsult.save();
};

// Actualizar consulta
export const updateConsult = async (
	id: string,
	updates: Partial<Omit<ClinicData, "id">>,
): Promise<ClinicData | null> => {
	const updatedConsult = await Consult.findById(id);
	if (!updatedConsult) return null;

	// Actualizar campos permitidos
	if (updates.petId) updatedConsult.petId = updates.petId;
	if (updates.vetId) updatedConsult.vetId = updates.vetId;
	if (updates.consult) updatedConsult.consult = updates.consult;
	if (updates.treatment) updatedConsult.treatment = updates.treatment;

	await updatedConsult?.save();

	return {
		id: updatedConsult._id.toString(),
		petId: updatedConsult.petId,
		vetId: updatedConsult.vetId,
		consult: updatedConsult.consult,
		treatment: updatedConsult.treatment,
	};
};

// Eliminar consulta
export const deleteConsult = async (id: string): Promise<boolean> => {
	const result = await Consult.findByIdAndDelete(id);
	// !!result devuelve TRUE si lo encuentra y borra
	// !!result devuelve FALSE si no lo encuentra
	return !!result;
};
