// CREAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
	e.preventDefault();
	crearUsuario();
});

// Función para obtener los datos de los input
function getInputData() {
	const username = document.getElementById("username").value;
	const email = document.getElementById("email").value;
	const rol = document.getElementById("rol").value;
	const password = document.getElementById("password").value;
	return {
		username: username.trim(),
		email: email.trim(),
		rol: rol.trim(),
		password: password.trim(),
	};
}

async function crearUsuario() {
	try {
		// Obtiene los datos del formulario
		const nuevoUsuario = getInputData();

		// Valida que los campos no estén vacíos
		if (
			!nuevoUsuario.username ||
			!nuevoUsuario.email ||
			!nuevoUsuario.rol ||
			!nuevoUsuario.password
		) {
			alert("Por favor, completa todos los campos");
			return;
		}

		// Validar formato de email (opcional)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(nuevoUsuario.email)) {
			alert("Por favor, ingresa un email válido");
			return;
		}
		const response = await fetch("http://localhost:8000/api/users/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(nuevoUsuario),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();
		console.log("Usuario creado:", datos);

		alert("Usuario creado correctamente");
	} catch (error) {
		console.error("Error:", error);
	}
}
