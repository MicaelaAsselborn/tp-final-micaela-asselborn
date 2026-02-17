const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	listarUsuario();
});

function crearElementoUsuario(usuario) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosUsuario = document.createElement("p");
	datosUsuario.textContent = `ID: ${usuario.id} | USUARIO: ${usuario.username} | EMAIL: ${usuario.email} | ROL: ${usuario.role}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("userId", usuario.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const userId = this.getAttribute("userId");
		window.location.href = `editarUsuario.html?id=${userId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarUsuario(usuario.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosUsuario);
	divContenedor.appendChild(botonera);

	return divContenedor;
}
const token = localStorage.getItem("token");

async function listarUsuario() {
	const listBox = document.getElementById("findings");
	const input = document.getElementById("search").value.trim(); // ✅ trim()

	// Validar que el input no esté vacío
	if (!input) {
		listBox.innerHTML = "<p>Por favor, ingresa un término de búsqueda</p>";
		return;
	}

	listBox.innerHTML = "<p>Cargando...</p>"; // Indicador de carga

	try {
		let response;

		// Caso 1: Búsqueda por ID (si es un número)
		if (/^\d+$/.test(input)) {
			response = await fetch(`http://localhost:8000/api/users/${input}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Usuario con ID ${input} no encontrado`);
			}

			const usuario = await response.json();
			listBox.innerHTML = ""; // Limpiar mensaje de carga
			const datosUsuario = crearElementoUsuario(usuario);
			listBox.appendChild(datosUsuario);
		}
		// Caso 2: Búsqueda por username (debe coincidir exactamente)
		else {
			// ✅ PRIMERO: Obtener TODOS los usuarios (o buscar por filtro)
			response = await fetch(`http://localhost:8000/api/users/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Error al obtener los usuarios");
			}

			const todosLosUsuarios = await response.json();

			// ✅ Filtrar SOLO el usuario que coincida EXACTAMENTE con el input
			const usuarioEncontrado = todosLosUsuarios.find(
				(usuario) =>
					usuario.username.toLowerCase() === input.toLowerCase(),
			);

			listBox.innerHTML = ""; // Limpiar

			if (usuarioEncontrado) {
				const datosUsuario = crearElementoUsuario(usuarioEncontrado);
				listBox.appendChild(datosUsuario);
			} else {
				listBox.innerHTML = `<p>No se encontró el usuario "${input}"</p>`;
			}
		}
	} catch (error) {
		listBox.innerHTML = `<p class="error">${error.message}</p>`;
		console.error("Error detallado:", error);
	}
}

// BORRAR USUARIO

async function borrarUsuario(id) {
	// Confirmación con el nombre del usuario
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar al usuario con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(`http://localhost:8000/api/users/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Usuario ${id} eliminado correctamente`);
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
