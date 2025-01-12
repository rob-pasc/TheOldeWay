document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, redirecting to login.");
    alert("No token found, redirecting to login.");
    window.location.href = "/camp.html"; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch("https://theoldeway.onrender.com/me", {
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById("username").textContent = data.username;
      // document.getElementById("email").textContent = data.email;
      document.getElementById("created_at").textContent = new Date(data.created_at).toLocaleString();
    } else {
      console.warn("Invalid token, redirecting to login.");
      alert("Invalid token, redirecting to login.");
      // alert(data.error || data.message);
      window.location.href = "./camp.html"; // Redirect to login if token is invalid
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Error fetching user data");
    window.location.href = "./camp.html"; // Redirect to login if there's an error
  }

  // Handle logout
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./battle.html"; // Redirect to login
  });
});
