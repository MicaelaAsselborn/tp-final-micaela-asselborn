import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { UserRole } from "../types/auth";

// findAllUsers
export const findAllUsers = async (_req: Request, res: Response) => {
	try {
		const users = await userService.findAllUsers();
		if (!users) {
			return res
				.status(404)
				.json({ error: "No se encontraron usuarios" });
		}

		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener los usuarios" });
	}
};

// findUserByUsernameOrEmail
export const findUserByUsernameOrEmail = async (
	req: Request,
	res: Response,
) => {
	const username = req.params.username as string;
	const email = req.params.email as string;
	try {
		const user = await userService.findUserByUsernameOrEmail(
			username,
			email,
		);
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener al usuario" });
	}
};

//findUserById
export const findUserById = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const user = await userService.findUserById(id);
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener el usuario" });
	}
};

// createUser
export const createUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req);
		// Si encuentra errores
		if (!errors.isEmpty()) {
			// Trae los errores en un array
			return res.status(400).json({ errors: errors.array() });
		}

		const { username, email, password, role } = req.body;
		const passwordString = password as string;
		const hashedPassword = await bcrypt.hash(passwordString, 10);

		const userRole =
			role && Object.values(UserRole).includes(role)
				? (role as UserRole)
				: UserRole.CLIENT;

		const user = await userService.createUser({
			username,
			email,
			password: hashedPassword,
			role: userRole,
		});

		return res
			.status(201)
			.json({ user, message: "Usuario creado exitosamente" });
	} catch (error: any) {
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ error: "El usuario o email ya existe" });
		}
		return res.status(500).json({ error: "Error al crear el usuario" });
	}
};

// updateUser
export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const updates = req.body;

		const updatedUser = await userService.updateUser(id, updates);
		if (!updatedUser) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res
			.status(200)
			.json({ updatedUser, message: "Usuario actualizado exitosamente" });
	} catch (error: any) {
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ error: "El usuario o email ya existe" });
		}
		return res
			.status(500)
			.json({ error: "Error al actualizar el usuario" });
	}
};

// deleteUser
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const deletedUser = await userService.deleteUser(id);
		if (!deletedUser) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res
			.status(200)
			.json({ message: "Usuario eliminado exitosamente" });
	} catch (error) {
		return res.status(500).json({ error: "Error al eliminar el usuario" });
	}
};
