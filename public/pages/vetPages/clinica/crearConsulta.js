// CREAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
	e.preventDefault();
	crearConsulta();
});

// Función para obtener los datos de los input

function getInputData() {
	const petId = document.getElementById("petId").value;
	const consult = document.getElementById("consult").value;
	const treatment = document.getElementById("treatment").value;
	// Extraer vetId del token
	const datosUsuario = extraerUsernameYId(token);
	const vetId = datosUsuario && datosUsuario.id ? datosUsuario.id : "";
	return {
		petId: petId.trim(),
		vetId: vetId,
		consult: consult.trim(),
		treatment: treatment.trim(),
	};
}

async function crearConsulta() {
	try {
		// Obtiene los datos del formulario
		const nuevaConsulta = getInputData();

		// Valida que los campos no estén vacíos
		if (
			!nuevaConsulta.petId ||
			!nuevaConsulta.consult ||
			!nuevaConsulta.treatment
		) {
			alert("Por favor, completa todos los campos");
			return;
		}

		const response = await fetch("http://localhost:8000/api/clinic/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(nuevaConsulta),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datosClinicos = await response.json();

		alert("Consulta creada correctamente");

		window.location.href = "../vet.html";
	} catch (error) {
		console.error("Error:", error);
	}
}

// Mostrar nombre e id de usuario logueado
function extraerUsernameYId(token) {
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
			id: payload.id || payload._id || null,
		};
	} catch (error) {
		console.error("Error al decodificar token:", error);
		return null;
	}
}

// Obtener token y extraer datos
const datosUsuario = extraerUsernameYId(token);

const nombre = document.getElementById("vetName");
nombre.innerText = datosUsuario.username;
