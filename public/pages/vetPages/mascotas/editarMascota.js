const token = localStorage.getItem("token");
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	actualizarMascota();
});

let urlId = null; // Variable global

document.addEventListener("DOMContentLoaded", async function () {
	const urlParams = new URLSearchParams(window.location.search);
	urlId = urlParams.get("id"); // Asignar a variable global

	if (urlId) {
		await getIdData(urlId);
	}
});

const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function getIdData(id) {
	try {
		const response = await fetch(`${url}api/pets/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error al obtener los datos");
		}

		const datosMascota = await response.json();

		const idMascota = document.getElementById("idMascota");
		idMascota.textContent = datosMascota.id;

		const nombre = document.getElementById("nombre");
		nombre.textContent = datosMascota.name;

		const especie = document.getElementById("especie");
		especie.textContent = datosMascota.species;

		const idDuenio = document.getElementById("idDuenio");
		idDuenio.textContent = datosMascota.ownerId;

		const idVet = document.getElementById("idVet");
		idVet.textContent = datosMascota.vetId;
	} catch (error) {
		console.error("Error:", error);
	}
}

// Función para obtener los datos de los input
function getInputData() {
	const name = document.getElementById("name").value;
	const specie = document.getElementById("specie").value;
	const ownerId = document.getElementById("ownerId").value;
	const vetId = document.getElementById("vetId").value;

	if (specie === "Elige una opción") {
		return {
			name: name.trim(),
			ownerId: ownerId.trim(),
			vetId: vetId.trim(),
		};
	} else {
		return {
			name: name.trim(),
			species: specie,
			ownerId: ownerId.trim(),
			vetId: vetId.trim(),
		};
	}
}

async function actualizarMascota() {
	if (!urlId) {
		alert("No se encontró el ID de la mascota en la URL");
		return;
	}

	try {
		// Obtiene los datos del formulario
		const masctotaActualizada = getInputData();

		const response = await fetch(`${url}api/pets/${urlId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(masctotaActualizada),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();

		alert("Mascota actualizada correctamente");
		window.location.reload();
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

const nombre = document.getElementById("vetName");
nombre.innerText = datosUsuario.username;
