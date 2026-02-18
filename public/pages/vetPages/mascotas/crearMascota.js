// CREAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
	e.preventDefault();
	crearMascota();
});

// Función para obtener los datos de los input
function getInputData() {
	const name = document.getElementById("name").value;
	const specie = document.getElementById("specie").value;
	const ownerId = document.getElementById("ownerId").value;
	const vetId = document.getElementById("vetId").value;
	return {
		name: name.trim(),
		specie: specie,
		ownerId: ownerId.trim(),
		vetId: vetId.trim(),
	};
}

async function crearMascota() {
	try {
		// Obtiene los datos del formulario
		const nuevaMascota = getInputData();

		// Valida que los campos no estén vacíos
		if (
			!nuevMascota.name ||
			!nuevaMascota.specie ||
			!nuevaMascota.ownerId ||
			!nuevaMascota.vetId
		) {
			alert("Por favor, completa todos los campos");
			return;
		}

		const response = await fetch("http://localhost:8000/api/pets/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(nuevaMascota),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();

		alert("Usuario creado correctamente");

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
