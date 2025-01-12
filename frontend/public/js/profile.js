let new_user = false;

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, redirecting to login.");
    window.location.href = "/index.html"; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch("https://theoldeway.onrender.com/me", {
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("User data fetched successfully:", data);
      document.getElementById("username").textContent = data.username;
      document.getElementById("created_at").textContent = new Date(data.created_at).toLocaleString();
      new_user = data.times_logged_in === 0; // Set new_user based on times_logged_in
    } else {
      console.warn("Invalid token, redirecting to login.");
      // alert(data.error || data.message);
      window.location.href = "./index.html"; // Redirect to login if token is invalid
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    window.location.href = "./index.html"; // Redirect to login if there's an error
  }

  // Handle logout
  document.getElementById("logoutButton").addEventListener("click", () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    window.location.href = "./index.html"; // Redirect to login
  });
});
