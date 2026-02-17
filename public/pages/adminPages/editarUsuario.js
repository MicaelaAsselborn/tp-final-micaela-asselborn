// EDITAR USUARIO
const token = localStorage.getItem("token");
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	actualizarUsuario();
});

document.addEventListener("DOMContentLoaded", function () {
	const urlParams = new URLSearchParams(window.location.search);
	const userId = urlParams.get("id");
	console.log(userId);

	const userIdP = document.getElementById("userId");
	userIdP.textContent = userId;
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
		role: rol,
		password: password.trim(),
	};
}

async function actualizarUsuario() {
	try {
		// Obtiene el id de la URL
		const urlParams = new URLSearchParams(window.location.search);
		const id = urlParams.get("id");
		if (!id) {
			alert("No se encontró el ID de usuario en la URL");
			return;
		}
		// Obtiene los datos del formulario
		const usuarioActualizado = getInputData();

		const response = await fetch(`http://localhost:8000/api/users/${id}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(usuarioActualizado),
		});
		if (!response.ok) {
			throw new Error("Error al ingresar los datos");
		}
		const datos = await response.json();
		console.log("Usuario actualizado:", datos);

		alert("Usuario actualizado correctamente");
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
