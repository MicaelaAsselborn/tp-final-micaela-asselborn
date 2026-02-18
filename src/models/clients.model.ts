import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
	name: string;
	email: string;
	phone: string;
	createdOn: Date;
	updatedOn: Date;
}

const clientSchema = new Schema<IClient>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"],
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			match: [
				/^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
				"Por favor ingresa un número telefónico válido",
			],
		},
	},
	{ timestamps: true },
);

export const Client = mongoose.model<IClient>("duenios", clientSchema);

export interface ClientData {
	id: string;
	name: string;
	email: string;
	phone: string;
}
