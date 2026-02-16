// Función para recoger los inputs de email y password
function getLoginCredentials() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	return {
		email: email.trim(),
		password: password,
	};
}

// Evento del botón de ingreso
document.addEventListener("DOMContentLoaded", () => {
	const loginButton = document.querySelector("button");
	const message = document.getElementById("message");

	loginButton.addEventListener("click", async () => {
		const credentials = getLoginCredentials();

		const response = await fetch("http://localhost:8000/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
		if (!response.ok) {
			message.textContent = "Credenciales incorrectas";
		} else {
			const data = await response.json();
			const token = data.token;
			// Guardar token y redirigir a la página principal
			localStorage.setItem("token", token);
			const parsedToken = parseJwt(token);
			if (parsedToken.role === "admin") {
				window.location.href = "./pages/adminPages/admin.html";
			} else {
				window.location.href = "./pages/vetPages/vet.html";
			}
		}
	});
});

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
