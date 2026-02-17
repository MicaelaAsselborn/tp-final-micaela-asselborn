function crearElementoLista(usuario) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosUsuario = document.createElement("p");
	datosUsuario.textContent = `ID: ${usuario.id} | USUARIO: ${usuario.username} | EMAIL: ${usuario.email} | ROL: ${usuario.role}`;

	// Crea botonera
	const botonera = document.createElement("div");

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("userId", usuario.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const userId = this.getAttribute("userId");
		window.location.href = `editarUsuario.html?id=${userId}`;
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

// BORRAR USUARIO

async function borrarUsuario(id) {
	const response = await fetch(`http://localhost:8000/api/users/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	window.location.reload();
}
