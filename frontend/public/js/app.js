// app.js
document.getElementById('start-game-btn').addEventListener('click', async () => {
  try {
      const response = await fetch('https://theoldeway.onrender.com/players'); // Beispiel-Endpoint
      const players = await response.json();
      console.log(players);
      alert(`Es gibt ${players.length} Spieler!`);
  } catch (err) {
      console.error('Fehler beim Abrufen der Spieler:', err);
  }
});

async function registerPlayer(username, email, password) {
  try {
      const response = await fetch('https://theoldeway.onrender.com/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password_hash: password })
      });
      const data = await response.json();
      console.log('Registrierter Spieler:', data);
  } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
  }
}

