const new_user = localStorage.getItem("new_user") === 'true'; // Retrieve new_user from localStorage
if (new_user) {
  alert("Welcome, new user! Enjoy your first visit to the Armory.");
}