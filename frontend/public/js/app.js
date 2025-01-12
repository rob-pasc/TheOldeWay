if (window.location.protocol === 'https:' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('Service Worker Registration Failed:', err));
} else {
  console.warn('Service Worker not registered. HTTPS is required.');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', event => {
  console.log('beforeinstallprompt event fired'); // Debug log
  event.preventDefault();
  deferredPrompt = event;

  const installButton = document.getElementById('install-btn');
  console.log('Install button:', installButton); // Debug log
  if (installButton) {
    installButton.style.display = 'block';
    console.log('Install button displayed'); // Debug log
  } else {
    console.error('Install button not found'); // Debug log
  }

  installButton.addEventListener('click', () => {
    console.log('Install button clicked'); // Debug log
    installButton.style.display = 'none';
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM fully loaded and parsed'); // Debug log
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  const switchToLogin = document.getElementById("switchToLogin");
  const switchToRegister = document.getElementById("switchToRegister");

  console.log('Register form:', registerForm); // Debug log
  console.log('Login form:', loginForm); // Debug log
  console.log('Switch to Login button:', switchToLogin); // Debug log
  console.log('Switch to Register button:', switchToRegister); // Debug log

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
    // const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("https://theoldeway.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      // alert(data.message || data.error);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "./armory.html";
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
        window.location.href = "./armory.html";
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error(error);
    }
  });


});
