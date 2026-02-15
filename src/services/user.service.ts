import { UserRole } from "../types/auth";
import { UserData, User } from "../models/users.model";
import bcrypt from "bcrypt";

export declare type UserWithoutPassword = Omit<UserData, "password">;

// Encontrar todos los usuarios
export const findAllUsers = async (): Promise<UserWithoutPassword[] | null> => {
	const users = await User.find().select("-password").lean();
	if (!users) return null;

	return users.map((user) => ({
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		role: user.role as UserRole,
	}));
};

// Encontrar usuario por usuario o email
export const findUserByUsernameOrEmail = async (
	username: string = "",
	email: string = "",
): Promise<UserWithoutPassword | null> => {
	const user = await User.findOne({ $or: [{ email }, { username }] })
		.select("-password")
		.lean();
	if (!user) return null;

	return {
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		role: user.role as UserRole,
	};
};

// Encontrar usuario por ID
export const findUserById = async (
	id: string,
): Promise<UserWithoutPassword | null> => {
	const user = await User.findById(id).select("-password").lean();
	if (!user) return null;

	return {
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		role: user.role as UserRole,
	};
};

// Encontrar usuario con contraseña
export const findUserWithPassword = async (
	email: string,
): Promise<UserData | null> => {
	const user = await User.findOne({ email }).lean();
	if (!user) return null;

	return {
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		password: user.password,
		role: user.role as UserRole,
	};
};

// Crear usuario
export const createUser = async (
	user: Omit<UserData, "id">,
): Promise<UserWithoutPassword> => {
	const newUser = new User({
		username: user.username,
		email: user.email,
		password: user.password,
		role: user.role || UserRole.CLIENT,
	});
	return await newUser.save();
};

// Actualizar usuario
export const updateUser = async (
	id: string,
	updates: Partial<Omit<UserData, "id">>,
): Promise<UserWithoutPassword | null> => {
	const user = await User.findById(id);
	if (!user) return null;

	// Actualizar campos permitidos
	if (updates.username) user.username = updates.username;
	if (updates.email) user.email = updates.email;
	if (updates.role) user.role = updates.role as UserRole;
	if (updates.password) {
		user.password = await bcrypt.hash(updates.password, 10);
	}

	await user.save();

	return {
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		role: user.role as UserRole,
	};
};

// Eliminar usuario
export const deleteUser = async (id: string): Promise<boolean> => {
	const result = await User.findByIdAndDelete(id);
	// !!result devuelve TRUE si lo encuentra y borra
	// !!result devuelve FALSE si no lo encuentra
	return !!result;
};
