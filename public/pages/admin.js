function crearElementoLista(usuario) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosUsuario = document.createElement("p");
	datosUsuario.textContent = `Usuario: ${usuario.username} | Email: ${usuario.email} | Rol: ${usuario.role}`;

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
		debugger;
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

document.addEventListener("DOMContentLoaded", listarUsuarios());
