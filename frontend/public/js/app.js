// app.js
// document.getElementById('start-game-btn').addEventListener('click', async () => {
//   try {
//       const response = await fetch('https://theoldeway.onrender.com/players'); // Beispiel-Endpoint
//       const players = await response.json();
//       console.log(players);
//       alert(`Es gibt ${players.length} Spieler!`);
//   } catch (err) {
//       console.error('Fehler beim Abrufen der Spieler:', err);
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  const switchToLogin = document.getElementById("switchToLogin");
  const switchToRegister = document.getElementById("switchToRegister");

  const registerButton = document.getElementById("registerButton");
  const loginButton = document.getElementById("loginButton");

  switchToLogin.addEventListener("click", () => {
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  });

  switchToRegister.addEventListener("click", () => {
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
  });

  registerButton.addEventListener("click", async () => {
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("https://theoldeway.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error(error);
    }
  });

  loginButton.addEventListener("click", async () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("https://theoldeway.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error(error);
    }
  });
});




