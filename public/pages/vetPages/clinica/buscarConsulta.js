const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	listarConsultas();
});

function crearElementoLista(consulta) {
	// Crea div contenedor
	const divContenedor = document.createElement("div");
	divContenedor.className = "div-lista-busqueda";

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
		window.location.href = `./editarClinica.html?id=${clinicId}`;
	});

	// Crea boton eliminar
	const deleteButton = document.createElement("button");
	deleteButton.className = "deleteButton";
	deleteButton.textContent = "Borrar";
	deleteButton.addEventListener("click", async () => {
		borrarClinicos(clinic.id);
	});

	// Ensambla la estructura
	botonera.appendChild(editButton);
	botonera.appendChild(deleteButton);
	divContenedor.appendChild(datosClinicos);
	divContenedor.appendChild(botonera);

	return divContenedor;
}

const token = localStorage.getItem("token");
const url =
	window.location.hostname === "localhost"
		? "http://localhost:8000/"
		: "https://veterinariapatitasfelicesmonolito.vercel.app/";

async function listarConsultas() {
	const listBox = document.getElementById("findings");
	const input = document.getElementById("search").value.trim();
	try {
		const response = await fetch(`${url}api/clinic/${input}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		listBox.innerHTML = ""; // Limpiar

		if (!response.ok) {
			throw new Error("Error al obtener los datos");
		}
		const consultaEncontrada = await response.json();

		if (consultaEncontrada) {
			const datosConsulta = crearElementoLista(consultaEncontrada);
			listBox.appendChild(datosConsulta);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

// BORRAR CONSULTA
async function borrarClinicos(id) {
	// Confirmación con el nombre de la mascota
	const confirmacion = confirm(
		`¿Estás seguro de que quieres eliminar la consulta con ID ${id}?\nEsta acción no se puede deshacer.`,
	);

	if (!confirmacion) return;

	try {
		const response = await fetch(`${url}api/clinic/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || "Error al eliminar");
		}

		alert(`✅ Consulta con ID: ${id} eliminada correctamente`);
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

// Obtener token y extraer datos
const datosUsuario = extraerUsername(token);

const nombre = document.getElementById("vetName");
nombre.innerText = datosUsuario.username;
