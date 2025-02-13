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

async function acceptFriendRequest(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://theoldeway.onrender.com/accept-friend-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Friend request accepted");
      await getFriendRequests(); // Refresh the friend requests list
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
}

async function rejectFriendRequest(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://theoldeway.onrender.com/reject-friend-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Friend request rejected");
      await getFriendRequests(); // Refresh the friend requests list
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error rejecting friend request:", error);
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
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.classList.add("btn", "btn-success", "ms-2");
        acceptButton.addEventListener("click", () => acceptFriendRequest(request.user_id));
        const rejectButton = document.createElement("button");
        rejectButton.textContent = "Reject";
        rejectButton.classList.add("btn", "btn-danger", "ms-2");
        rejectButton.addEventListener("click", () => rejectFriendRequest(request.user_id));
        listItem.appendChild(acceptButton);
        listItem.appendChild(rejectButton);
        friendRequestsList.appendChild(listItem);
      });
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error retrieving friend requests:", error);
  }
}

async function getFriends() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://theoldeway.onrender.com/friends", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      const friendsList = document.getElementById("friendsList");
      friendsList.innerHTML = "";
      data.forEach(friend => {
        const listItem = document.createElement("li");
        listItem.textContent = friend.username;
        friendsList.appendChild(listItem);
      });
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error("Error retrieving friends:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, redirecting to login.");
    window.location.href = "/index.html"; 
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
      new_user = data.times_logged_in === 0; 
      localStorage.setItem("new_user", new_user); 
    } else {
      console.warn("Invalid token, redirecting to login.");
      window.location.href = "./index.html"; 
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    window.location.href = "./index.html"; 
  }

  await getFriendRequests();
  await getFriends();

  document.getElementById("logoutButton").addEventListener("click", () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    window.location.href = "./index.html"; 
  });
});
