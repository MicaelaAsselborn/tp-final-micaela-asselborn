function crearElementoLista(usuario) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosUsuario = document.createElement("p");
	datosUsuario.textContent = `USUARIO: ${usuario.username} | EMAIL: ${usuario.email} | ROL: ${usuario.role}`;

	// Crea botonera
	const botonera = document.createElement("div");

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.textContent = "Editar";

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosUsuario);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

const token = localStorage.getItem("token");
async function listarUsuarios() {
	const listBox = document.getElementById("users-list");
	try {
		const response = await fetch("http://localhost:8000/api/users/", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Error al obtener los datos");
		}
		const datos = await response.json();
		console.log(datos);

		datos.forEach((usuario) => {
			const datosUsuario = crearElementoLista(usuario);
			listBox.appendChild(datosUsuario);
		});
	} catch (error) {
		console.error("Error:", error);
	}
}

function extraerUsernameYId(token) {
	if (!token) return null;

	try {
		// Decodificar el payload del JWT (parte del medio)
		var base64Url = token.split(".")[1];
		var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		var jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map(function (c) {
					return (
						"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
					);
				})
				.join(""),
		);

		// Parsear el payload
		var payload = JSON.parse(jsonPayload);

		// Extraer username y id (adaptado a posibles nombres de propiedades)
		return {
			id: payload.id || null,
			username: payload.username || null,
		};
	} catch (error) {
		console.error("Error al decodificar token:", error);
		return null;
	}
}

// Obtener token y extraer datos
const datosUsuario = extraerUsernameYId(token);

const nombre = document.getElementById("adminName");
nombre.innerText = datosUsuario.username;

const id = document.getElementById("adminId");
id.innerText = datosUsuario.id;

document.addEventListener("DOMContentLoaded", listarUsuarios());
