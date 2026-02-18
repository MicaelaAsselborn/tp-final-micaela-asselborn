import { Pet, PetData } from "../models/pets.model";
import { PetSpecies } from "../types/pet";

// Encontrar todas las mascotas
export const findAllPets = async (): Promise<PetData[] | null> => {
	const pets = await Pet.find().lean();
	if (!pets) return null;

	return pets.map((pet) => ({
		id: pet._id.toString(),
		name: pet.name,
		species: pet.species as PetSpecies,
		ownerId: pet.ownerId,
		vetId: pet.vetId,
	}));
};

// Encontrar mascota por ID
export const findPetById = async (id: string): Promise<PetData | null> => {
	const pet = await Pet.findById(id).lean();
	if (!pet) return null;

	return {
		id: pet._id.toString(),
		name: pet.name,
		species: pet.species as PetSpecies,
		ownerId: pet.ownerId,
		vetId: pet.vetId,
	};
};

// Crear mascota
export const createPet = async (pet: Omit<PetData, "id">): Promise<PetData> => {
	const newPet = new Pet({
		name: pet.name,
		species: pet.species as PetSpecies,
		ownerId: pet.ownerId,
		vetId: pet.vetId,
	});
	return await newPet.save();
};

// Actualizar mascotas
export const updatePet = async (
	id: string,
	updates: Partial<Omit<PetData, "id">>,
): Promise<PetData | null> => {
	const pet = await Pet.findById(id);
	if (!pet) return null;

	// Actualizar campos permitidos
	if (updates.name) pet.name = updates.name;
	if (updates.species) pet.species = updates.species as PetSpecies;
	if (updates.ownerId) pet.ownerId = updates.ownerId;
	if (updates.vetId) pet.vetId = updates.vetId;

	await pet.save();

	return {
		id: pet._id.toString(),
		name: pet.name,
		species: pet.species as PetSpecies,
		ownerId: pet.ownerId,
		vetId: pet.vetId,
	};
};

// Eliminar mascota
export const deletePet = async (id: string): Promise<boolean> => {
	const result = await Pet.findByIdAndDelete(id);
	// !!result devuelve TRUE si lo encuentra y borra
	// !!result devuelve FALSE si no lo encuentra
	return !!result;
};
