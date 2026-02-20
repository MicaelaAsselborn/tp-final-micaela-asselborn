const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	listarMascota();
});

function crearElementoListaMascotas(mascota) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista-busqueda";

	// Crea párrafo
	const datosMascota = document.createElement("p");
	datosMascota.textContent = `ID: ${mascota.id} | NOMBRE: ${mascota.name} | ESPECIE: ${mascota.species} | DUEÑO: ${mascota.ownerId}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("petId", mascota.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const petId = this.getAttribute("petId");
		window.location.href = `./mascotas/editarMascota.html?id=${petId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarMascota(mascota.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosMascota);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

const token = localStorage.getItem("token");
const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function listarMascota() {
	const listBox = document.getElementById("findings");
	const input = document.getElementById("search").value.trim();
	try {
		const response = await fetch(`${url}api/pets/${input}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		listBox.innerHTML = ""; // Limpiar

		if (!response.ok) {
			throw new Error("Error al obtener los datos");
		}
		const mascotaEncontrada = await response.json();

		if (mascotaEncontrada) {
			const datosMascota = crearElementoListaMascotas(mascotaEncontrada);
			listBox.appendChild(datosMascota);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

// BORRAR MASCOTA
async function borrarMascota(id) {
	// Confirmación con el nombre de la mascota
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar la mascota con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(`${url}api/pets/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Mascota con ID:  ${id} eliminada correctamente`);
		window.location.reload();
	} catch (error) {
		console.error("Error:", error);
		alert(`❌ Error: ${error.message}`);
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

const nombre = document.getElementById("vetName");
nombre.innerText = datosUsuario.username;
