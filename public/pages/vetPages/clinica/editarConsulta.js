const token = localStorage.getItem("token");
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	actualizarConsulta();
});

let urlId = null; // Variable global

document.addEventListener("DOMContentLoaded", async function () {
	const urlParams = new URLSearchParams(window.location.search);
	urlId = urlParams.get("id"); // Asignar a variable global

	if (urlId) {
		await getIdData(urlId);
	}
});
console.log(urlId);
const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function getIdData(id) {
	try {
		const response = await fetch(`${url}api/clinic/${id}`, {
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

		const idConsulta = document.getElementById("idConsulta");
		idConsulta.textContent = datos.id;

		const idMascota = document.getElementById("idMascota");
		idMascota.textContent = datos.petId;

		const consulta = document.getElementById("consulta");
		consulta.textContent = datos.consult;

		const tratamiento = document.getElementById("tratamiento");
		tratamiento.textContent = datos.treatment;
	} catch (error) {
		console.error("Error:", error);
	}
}

// Función para obtener los datos de los input
function getInputData() {
	const petId = document.getElementById("petId").value;
	const consult = document.getElementById("consult").value;
	const treatment = document.getElementById("treatment").value;
	return {
		petId: petId.trim(),
		consult: consult.trim(),
		treatment: treatment.trim(),
	};
}

async function actualizarConsulta() {
	try {
		if (!urlId) {
			alert("No se encontró el ID de la consulta en la URL");
			return;
		}
		// Obtiene los datos del formulario
		const consultaActualizada = getInputData();

		const response = await fetch(`${url}api/clinic/${urlId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(consultaActualizada),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();

		alert("Consulta actualizada correctamente");
		window.location.href = "../vet.html";
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

		// Extraer username
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
