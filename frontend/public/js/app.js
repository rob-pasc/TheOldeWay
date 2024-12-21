if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('js/service-worker.js').then(
      // registration => console.log('ServiceWorker registered:', registration),
      // err => console.error('ServiceWorker registration failed:', err)
      // registration => alert('ServiceWorker registered:' + registration),
      err => alert('ServiceWorker registration failed:' + err)
    );
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing.
  e.preventDefault();
  deferredPrompt = e;
  console.log('Add to Home Screen prompt available.');

  // Show your custom "Install" button and add a click listener.
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt(); // Show the install prompt.
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt.');
      } else {
        console.log('User dismissed the install prompt.');
      }
      deferredPrompt = null;
    });
  });
});



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
      // alert(data.message || data.error);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "./profile.html";
      } else {
        alert(data.error || data.message);
      }
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
      // alert(data.message || data.error);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "./profile.html";
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error(error);
    }
  });
});




