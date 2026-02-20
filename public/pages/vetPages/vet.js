const token = localStorage.getItem("token");
function parseJwt(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join(""),
	);

	return JSON.parse(jsonPayload);
}

const parsedToken = parseJwt(token);
if (parsedToken.role !== "vet") {
	window.location.href = "../unauthorized.html";
}

function crearElementoListaMascotas(mascota) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosMascota = document.createElement("p");
	datosMascota.textContent = `ID: ${mascota.id} | NOMBRE: ${mascota.name} | ESPECIE: ${mascota.species} | DUEÑO: ${mascota.ownerId} | VET: ${mascota.vetId}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("petId", mascota.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const petId = this.getAttribute("petId");
		window.location.href = `./mascotas/editarMascota.html?id=${petId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarMascota(mascota.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosMascota);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

async function listarMascotas() {
	const listBox = document.getElementById("pets-list");
	try {
		const response = await fetch("http://localhost:8000/api/pets/", {
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
		console.log(datos);

		datos.forEach((mascota) => {
			const datosMascota = crearElementoListaMascotas(mascota);
			listBox.appendChild(datosMascota);
		});
	} catch (error) {
		console.error("Error:", error);
	}
}

async function borrarMascota(id) {
	// Confirmación con el nombre de la mascota
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar la mascota con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(`http://localhost:8000/api/pets/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Mascota con ${id} eliminado correctamente`);
		window.location.reload();
	} catch (error) {
		console.error("Error:", error);
		alert(`❌ Error: ${error.message}`);
	}
}

// CLINICA

function crearElementoListaClinica(consulta) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosClinicos = document.createElement("p");
	datosClinicos.textContent = `ID: ${consulta.id} | ID MASCOTA: ${consulta.petId} | ID VET: ${consulta.vetId} | CONSULTA: ${consulta.consult} | TRATAMIENTO: ${consulta.treatment}`;

	// Crea botonera
	const botonera = document.createElement("div");
	botonera.className = "botonera";

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("clinicId", consulta.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const clinicId = this.getAttribute("clinicId");
		window.location.href = `./clinica/editarClinica.html?id=${clinicId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarCliente(clinic.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosClinicos);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

async function listarConsultas() {
	const listBox = document.getElementById("clinic-list");
	try {
		const response = await fetch("http://localhost:8000/api/clinic/", {
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

		datos.forEach((clinic) => {
			const datosClinicos = crearElementoListaClinica(clinic);
			listBox.appendChild(datosClinicos);
		});
	} catch (error) {
		console.error("Error:", error);
	}
}

async function borrarClinicos(id) {
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar la consulta con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(`http://localhost:8000/api/clinic/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ La consulta con ID: ${id} se eliminó correctamente`);
		window.location.reload();
	} catch (error) {
		console.error("Error:", error);
		alert(`❌ Error: ${error.message}`);
	}
}

// CLIENTES

function crearElementoListaClientes(cliente) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista";

	// Crea párrafo
	const datosCliente = document.createElement("p");
	datosCliente.textContent = `ID: ${cliente.id} | NOMBRE: ${cliente.name} | EMAIL: ${cliente.email} | TELÉFONO: ${cliente.phone}`;

	// Crea botonera
	const botonera = document.createElement("div");

	// Crea boton editar
	const editButton = document.createElement("button");
	editButton.className = "editButton";
	editButton.setAttribute("clientId", cliente.id);
	editButton.textContent = "Editar";
	editButton.addEventListener("click", function () {
		const clientId = this.getAttribute("clientId");
		window.location.href = `./clientes/editarCliente.html?id=${clientId}`;
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

async function listarClientes() {
	const listBox = document.getElementById("clients-list");
	try {
		const response = await fetch("http://localhost:8000/api/clients/", {
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

		datos.forEach((cliente) => {
			const datosCliente = crearElementoListaClientes(cliente);
			listBox.appendChild(datosCliente);
		});
	} catch (error) {
		console.error("Error:", error);
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

function logOff() {
	localStorage.removeItem("token");
	window.location.href = "../../index.html";
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
			id: payload.id || null,
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

document.addEventListener(
	"DOMContentLoaded",
	listarMascotas(),
	listarClientes(),
	listarConsultas(),
);
