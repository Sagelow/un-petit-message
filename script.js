// script.js
window.addEventListener("DOMContentLoaded", () => {
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error("Impossible de charger data.json");
      return response.json();
    })
    .then(data => {
      const keys = Object.keys(data).sort(); // clés triées
      const titleEl = document.getElementById('title');
      const messageEl = document.getElementById('message');
      const timerEl = document.getElementById('timer'); // facultatif

      function updateMessage() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');

        const currentKey = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

        // Trouver le dernier message passé ou le premier message si aucun
        let currentMessage = data[keys[0]];
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] <= currentKey) {
            currentMessage = data[keys[i]];
          } else {
            break;
          }
        }

        // Afficher le message
        titleEl.textContent = currentMessage.title;
        messageEl.innerHTML = currentMessage.message;

        // Appliquer une taille de police spéciale si définie dans le JSON
        if (currentMessage.fontSize) {
          messageEl.style.fontSize = currentMessage.fontSize;
        } else {
          messageEl.style.fontSize = "16px"; // taille par défaut
        }

        // Si tu veux, afficher un compte à rebours jusqu'au prochain message
        const nextKey = keys.find(k => k > currentKey);
        if (nextKey && timerEl) {
          const targetDate = new Date(nextKey);
          let diff = targetDate - now;
          if (diff < 0) diff = 0;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
        } else if (timerEl) {
          timerEl.textContent = "";
        }
      }

      // Mettre à jour immédiatement et toutes les secondes
      updateMessage();
      setInterval(updateMessage, 1000);
    })
    .catch(error => {
      console.error("Erreur :", error);
      document.getElementById('title').textContent = "Erreur de chargement";
      document.getElementById('message').textContent = "";
    });
});
