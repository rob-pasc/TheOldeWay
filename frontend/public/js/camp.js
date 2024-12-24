document.addEventListener("DOMContentLoaded", () => {
  const deckList = document.getElementById("deck-list");
  const overlay = document.getElementById("overlay");
  const cardList = document.getElementById("card-list");
  const closeOverlay = document.getElementById("close-overlay");

  // Fetch decks from the server
  fetch("https://theoldeway.onrender.com/decks")
    .then(response => response.json())
    .then(decks => {
      decks.forEach(deck => {
        const deckItem = document.createElement("a");
        deckItem.href = `deck.html?deckId=${deck.deck_id}`;
        deckItem.className = "list-group-item list-group-item-action";
        deckItem.textContent = deck.deck_name;
        deckList.appendChild(deckItem);
      });
    })
    .catch(error => console.error("Error fetching decks:", error));

  // Handle overlay close
  closeOverlay.addEventListener("click", () => {
    overlay.classList.add("d-none");
  });
});
