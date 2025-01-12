let new_user = false;

async function sendFriendRequest(friendUsername) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://theoldeway.onrender.com/friend-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ friendUsername })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Friend request sent");
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
}

async function getFriendRequests() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://theoldeway.onrender.com/friend-requests", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      const friendRequestsList = document.getElementById("friendRequestsList");
      friendRequestsList.innerHTML = "";
      data.forEach(request => {
        const listItem = document.createElement("li");
        listItem.textContent = request.username;
        friendRequestsList.appendChild(listItem);
      });
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error retrieving friend requests:", error);
  }
}

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
      localStorage.setItem("new_user", new_user); // Store new_user in localStorage
    } else {
      console.warn("Invalid token, redirecting to login.");
      // alert(data.error || data.message);
      window.location.href = "./index.html"; // Redirect to login if token is invalid
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    window.location.href = "./index.html"; // Redirect to login if there's an error
  }

  await getFriendRequests();

  // Handle logout
  document.getElementById("logoutButton").addEventListener("click", () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    window.location.href = "./index.html"; // Redirect to login
  });
});
