document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const deckId = urlParams.get("deckId");
  const deckNameElement = document.getElementById("deck-name");
  const cardList = document.getElementById("card-list");

  if (deckId) {
    fetch(`https://theoldeway.onrender.com/decks/${deckId}`)
      .then(response => response.json())
      .then(deck => {
        deckNameElement.textContent = deck.deck_name;
      })
      .catch(error => console.error("Error fetching deck:", error));

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
      })
      .catch(error => console.error("Error fetching cards:", error));
  } else {
    deckNameElement.textContent = "Deck not found";
  }
});
