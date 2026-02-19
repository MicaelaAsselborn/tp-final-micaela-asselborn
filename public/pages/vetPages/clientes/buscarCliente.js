const form = document.querySelector("form");
const token = localStorage.getItem("token");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	listarCliente();
});

function crearElementoListaClientes(cliente) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosCliente = document.createElement("p");
	datosCliente.textContent = `ID: ${cliente.id} | NOMBRE: ${cliente.name} | EMAIL: ${cliente.email} | TELÉFONO: ${cliente.phone}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("clientId", cliente.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const clientId = this.getAttribute("clientId");
		window.location.href = `./editarCliente.html?id=${clientId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarCliente(cliente.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosCliente);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

async function listarCliente() {
	const listBox = document.getElementById("results");
	const input = document.getElementById("search").value.trim();

	// Limpiar resultados previos
	listBox.innerHTML = "";

	// Validar que el input no esté vacío
	if (!input) {
		listBox.innerHTML = "<p>Por favor, ingresa un término de búsqueda</p>";
		return;
	}

	listBox.innerHTML = "<p>Cargando...</p>"; // Indicador de carga

	try {
		// Puedes cambiar a ?email= si buscas por email
		const url = input.includes("@")
			? `http://localhost:8000/api/clients/search?email=${encodeURIComponent(input)}`
			: `http://localhost:8000/api/clients/search?name=${encodeURIComponent(input)}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error al obtener los datos");
		}

		const clienteEncontrado = await response.json();

		listBox.innerHTML = ""; // Limpiar

		if (clienteEncontrado) {
			const datosCliente = crearElementoListaClientes(clienteEncontrado);
			listBox.appendChild(datosCliente);
		} else {
			listBox.innerHTML = "<p>No se encontró ningún cliente</p>";
		}
	} catch (error) {
		console.error("Error:", error);
		listBox.innerHTML = "<p>Error al buscar el cliente</p>";
	}
}

async function borrarCliente(id) {
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar al cliente con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(
			`http://localhost:8000/api/clients/${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Cliente ${id} eliminado correctamente`);
		window.location.reload();
	} catch (error) {
		console.error("Error:", error);
		alert(`❌ Error: ${error.message}`);
	}
}

// Mostrar nombre del usuario logueado
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
