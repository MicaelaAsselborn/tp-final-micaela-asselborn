// EDITAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	actualizarConsulta();
});

document.addEventListener("DOMContentLoaded", function () {
	const urlParams = new URLSearchParams(window.location.search);
	const clinicId = urlParams.get("id");
	const clinicIdP = document.getElementById("clinicId");
	clinicIdP.textContent = clinicId;
});

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

const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function actualizarConsulta() {
	try {
		// Obtiene el id de la URL
		const urlParams = new URLSearchParams(window.location.search);
		const id = urlParams.get("id");
		if (!id) {
			alert("No se encontró el ID de la consulta en la URL");
			return;
		}
		// Obtiene los datos del formulario
		const consultaActualizada = getInputData();

		const response = await fetch(`${url}api/clinic/${id}`, {
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
