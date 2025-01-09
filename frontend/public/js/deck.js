document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const deckId = urlParams.get("deckId");
  const deckNameElement = document.getElementById("deck-name");
  const cardList = document.getElementById("card-list");
  const cardOverlay = document.getElementById("card-overlay");
  const closeCardOverlay = document.getElementById("close-card-overlay");
  const cardImage = document.getElementById("card-image");
  const cardName = document.getElementById("card-name");
  const cardDesc = document.getElementById("card-desc");
  const cardType = document.getElementById("card-type");
  const cardExtra = document.getElementById("card-extra");
  const combatantList = document.getElementById("combatant-list");
  const spellList = document.getElementById("spell-list");

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
        combatantList.innerHTML = "";
        spellList.innerHTML = "";
        cards.forEach(card => {
          const cardItem = document.createElement("li");
          cardItem.className = "list-group-item d-flex justify-content-between align-items-center";
          
          const icon = document.createElement("img");
          icon.style.width = "24px";
          icon.style.height = "24px";
          icon.className = "me-2";
          if (card.card_type === 'combatant') {
            icon.src = './assets/card/icon/combatant.svg';
          } else if (card.card_type === 'spell') {
            icon.src = './assets/card/icon/scroll.svg';
          }

          const cardText = document.createElement("span");
          cardText.className = "flex-grow-1";
          cardText.textContent = `${card.quantity}x ${card.card_name}`;

          const mightText = document.createElement("span");
          mightText.className = "text-end";
          if (card.card_type === 'combatant') {
            mightText.textContent = card.might;
          }

          cardItem.appendChild(icon);
          cardItem.appendChild(cardText);
          cardItem.appendChild(mightText);

          if (card.card_type === 'combatant') {
            combatantList.appendChild(cardItem);
          } else if (card.card_type === 'spell') {
            spellList.appendChild(cardItem);
          }
        });
      })
      .catch(error => console.error("Error fetching cards:", error));
  } else {
    deckNameElement.textContent = "Deck not found";
  }

  cardList.addEventListener("click", event => {
    if (event.target && event.target.matches("li.list-group-item")) {
      const cardId = event.target.dataset.cardId;
      fetch(`https://theoldeway.onrender.com/cards/${cardId}`)
        .then(response => response.json())
        .then(card => {
          cardName.textContent = card.card_name;
          cardDesc.textContent = card.card_desc;
          cardType.textContent = `Type: ${card.card_type}`;
          if (card.card_type === "combatant") {
            cardExtra.textContent = `Might: ${card.might}, Ability: ${card.ability}`;
          } else if (card.card_type === "spell") {
            cardExtra.textContent = `Effect: ${card.effect}`;
          }

          fetch("./assets/card/cardMapping.json")
            .then(response => response.json())
            .then(mapping => {
              const cardData = mapping[card.card_id];
              if (cardData) {
                cardImage.src = cardData.img;
              } else {
                cardImage.src = "";
              }
            })
            .catch(error => console.error("Error fetching card mapping:", error));

          const cardTypeIcon = document.getElementById('card-type-icon');
          const cardMight = document.getElementById('card-might');
          if (card.card_type === 'combatant') {
            cardTypeIcon.src = './assets/card/icon/combatant.svg';
            cardMight.textContent = card.might;
          } else if (card.card_type === 'spell') {
            cardTypeIcon.src = './assets/card/icon/scroll.svg';
            cardMight.textContent = '';
          } else {
            cardTypeIcon.src = '';
            cardMight.textContent = '';
          }

          cardOverlay.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching card details:", error));
    }
  });

  closeCardOverlay.addEventListener("click", () => {
    cardOverlay.classList.add("d-none");
  });
});
