import mongoose, { Schema, Document } from "mongoose";
import { PetSpecies } from "../types/pet";

export interface IPet extends Document {
	name: string;
	species: PetSpecies;
	ownerId: string;
	vetId: string;
	createdOn: Date;
	updatedOn: Date;
}

const petSchema = new Schema<IPet>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		species: {
			type: String,
			required: true,
			trim: true,
		},
		ownerId: {
			type: String,
			required: true,
		},
		vetId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

export const Pet = mongoose.model<IPet>("mascotas", petSchema);

export interface PetData {
	id: string;
	name: string;
	species: PetSpecies;
	ownerId: string;
	vetId: string;
}
