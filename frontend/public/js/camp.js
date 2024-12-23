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
        deckItem.href = "#";
        deckItem.className = "list-group-item list-group-item-action";
        deckItem.textContent = deck.deck_name;
        deckItem.dataset.deckId = deck.deck_id;
        deckList.appendChild(deckItem);
      });
    })
    .catch(error => console.error("Error fetching decks:", error));

  // Handle deck click
  deckList.addEventListener("click", event => {
    if (event.target && event.target.matches("a.list-group-item")) {
      const deckId = event.target.dataset.deckId;
      fetch(`https://theoldeway.onrender.com/decks/${deckId}/cards`)
        .then(response => response.json())
        .then(cards => {
          cardList.innerHTML = "";
          cards.forEach(card => {
            const cardItem = document.createElement("li");
            cardItem.className = "list-group-item";
            cardItem.textContent = `${card.card_id}: ${card.card_name}`;
            cardList.appendChild(cardItem);
          });
          overlay.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching cards:", error));
    }
  });

  // Handle overlay close
  closeOverlay.addEventListener("click", () => {
    overlay.classList.add("d-none");
  });
});
