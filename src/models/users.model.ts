import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../types/auth";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"],
		},
		password: { type: String, required: true, minlength: 8 },
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.CLIENT,
		},
	},
	{ timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model<IUser>("usuarios", userSchema);

export interface UserData {
	id: string;
	username: string;
	email: string;
	password: string;
	role: UserRole;
}
