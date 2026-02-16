const token = localStorage.getItem(token);

function mostrarUsuarios() {
	fetch("http://localhost:3000/api/pets/", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error en la petición");
			}
			return response.json();
		})
		.then((data) => {
			listarUsuarios(data);
		})
		.catch((error) => console.error("Error:", error));
}

function listarUsuarios() {
	const listBox = document.getElementById("list");
	listBox.innerHTML = ""; //Limpiar lista existente

	datos.forEach((usuario) => {
		const divContenedor = document.createElement("div");
		divContenedor.className = "div-lista";
		const p = document.createElement("p");
		const button = document.createElement("button");
	});
}

// // Función para mostrar los datos en una lista HTML
// function mostrarEnLista(datos) {
//   const lista = document.getElementById('mi-lista');
//   lista.innerHTML = ''; // Limpiar lista existente

//   datos.forEach(item => {
//     const li = document.createElement('li');
//     li.textContent = item.nombre; // Ajusta según la estructura de tus datos
//     // O si quieres mostrar más información:
//     // li.textContent = `${item.id} - ${item.nombre} - ${item.email}`;
//     lista.appendChild(li);
//   });
// }

// // Llamar a la función cuando la página cargue
// document.addEventListener('DOMContentLoaded', listarDatos);
