document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html"; // Redirect to login if no token
      return;
    }
  
    try {
      const response = await fetch("https://theoldeway.onrender.com/me", {
        headers: { "Authorization": `Bearer ${token}` },
      });
  
      const data = await response.json();
      if (response.ok) {
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;
        document.getElementById("created_at").textContent = new Date(data.created_at).toLocaleString();
      } else {
        alert(data.error || data.message);
        window.location.href = "./index.html"; // Redirect to login if token is invalid
      }
    } catch (error) {
      console.error(error);
      window.location.href = "./index.html"; // Redirect to login if there's an error
    }
  
    // Handle logout
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "./index.html"; // Redirect to login
    });
  });
  