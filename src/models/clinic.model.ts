import mongoose, { Schema, Document } from "mongoose";

export interface IClinic extends Document {
	petId: string;
	vetId: string;
	consult: string;
	treatment: string;
	createdOn: Date;
	updatedOn: Date;
}

const clinicSchema = new Schema<IClinic>(
	{
		petId: {
			type: String,
			required: true,
			trim: true,
		},
		vetId: {
			type: String,
			required: true,
			trim: true,
		},
		consult: {
			type: String,
			required: true,
			trim: true,
		},
		treatment: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true },
);

export const Consult = mongoose.model<IClinic>(
	"historial_clinico",
	clinicSchema,
);

export interface ClinicData {
	id: string;
	petId: string;
	vetId: string;
	consult: string;
	treatment: string;
}
