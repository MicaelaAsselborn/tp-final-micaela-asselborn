// CREAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
	e.preventDefault();
	crearCliente();
});

// Función para obtener los datos de los input
function getInputData() {
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const phone = document.getElementById("phone").value;
	return {
		name: name.trim(),
		email: email.trim(),
		phone: phone.trim(),
	};
}

const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function crearCliente() {
	try {
		// Obtiene los datos del formulario
		const nuevoCliente = getInputData();

		// Valida que los campos no estén vacíos
		if (!nuevoCliente.name || !nuevoCliente.email || !nuevoCliente.phone) {
			alert("Por favor, completa todos los campos");
			return;
		}

		// Validar formato de email (opcional)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(nuevoCliente.email)) {
			alert("Por favor, ingresa un email válido");
			return;
		}
		const response = await fetch(`${url}api/clients/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(nuevoCliente),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();

		alert("Cliente creado correctamente");

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
