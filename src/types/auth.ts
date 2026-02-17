export interface JwtPayload {
	//jsonwebtoken Payload personalizado
	id: string;
	username: string;
	role: UserRole;
}

export enum UserRole {
	VET = "vet",
	ADMIN = "admin",
}
