const token = localStorage.getItem("token");
function parseJwt(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join(""),
	);

	return JSON.parse(jsonPayload);
}

const parsedToken = parseJwt(token);
if (parsedToken.role !== "admin") {
	window.location.href = "../unauthorized.html";
}

function crearElementoListaUsuarios(usuario) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosUsuario = document.createElement("p");
	datosUsuario.textContent = `ID: ${usuario.id} | USUARIO: ${usuario.username} | EMAIL: ${usuario.email} | ROL: ${usuario.role}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("userId", usuario.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const userId = this.getAttribute("userId");
		window.location.href = `./usuarios/editarUsuario.html?id=${userId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarUsuario(usuario.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosUsuario);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function listarUsuarios() {
	const listBox = document.getElementById("users-list");
	try {
		const response = await fetch(`${url}api/users/`, {
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

		datos.forEach((usuario) => {
			const datosUsuario = crearElementoListaUsuarios(usuario);
			listBox.appendChild(datosUsuario);
		});
	} catch (error) {
		console.error("Error:", error);
	}
}

async function borrarUsuario(id) {
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar al usuario con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		if (id === datosUsuario.id) {
			alert("❌ No puedes eliminarte a ti mismo");
			return;
		}

		const response = await fetch(`${url}api/users/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Usuario ${id} eliminado correctamente`);
		window.location.reload();
	} catch (error) {
		console.error("Error:", error);
		alert(`❌ Error: ${error.message}`);
	}
}

function logOff() {
	localStorage.removeItem("token");
	window.location.href = "../../index.html";
}

// Mostrar nombre e id de usuario logueado
function extraerUsername(token) {
	if (!token) return null;

	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
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
		const payload = JSON.parse(jsonPayload);

		// Extraer username y id
		return {
			username: payload.username || null,
			id: payload.id || null,
		};
	} catch (error) {
		console.error("Error al decodificar token:", error);
		return null;
	}
}

// Obtener token y extraer datos
const datosUsuario = extraerUsername(token);

const nombre = document.getElementById("adminName");
nombre.innerText = datosUsuario.username;

document.addEventListener("DOMContentLoaded", listarUsuarios());
