window.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("timer");
  const titleEl = document.getElementById("title");
  const messageEl = document.getElementById("message");
  const centerEl = document.querySelector(".center");
  const bodyEl = document.body;
  const imgEl = document.querySelector(".rose");
  const mainElOriginal = document.querySelector(".main");

  let lastKeyDisplayed = null; // Pour suivre le dernier message affiché

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const keys = Object.keys(data).sort();

      function getCurrentKey() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const sec = String(now.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}`;
      }

      function displayMessages(msgData) {
        titleEl.textContent = msgData.title || "";
        messageEl.innerHTML = "";

        if (!Array.isArray(msgData.messages)) return;

        msgData.messages.forEach((msg, index) => {
          const div = document.createElement("div");
          div.classList.add("message-item");
          div.classList.add(`delay-${index + 1}`);

          const author = document.createElement("span");
          author.className = msg.class || "";
          author.textContent = msg.author === "Tic...Tac..." ? "" : `<${msg.author}>`;

          const text = document.createElement("div");
          text.innerHTML = msg.text;

          div.appendChild(author);
          div.appendChild(text);
          messageEl.appendChild(div);

          if (msg.author !== "Tic...Tac..." && index < msgData.messages.length - 1) {
            const hr = document.createElement("hr");
            messageEl.appendChild(hr);
          }
        });
      }

      function update() {
        const now = new Date();
        const currentKey = getCurrentKey();

        // Trouver le dernier message passé
        let currentMsgKey = keys[0];
        for (const key of keys) {
          if (key <= currentKey) currentMsgKey = key;
          else break;
        }

        const currentMsg = data[currentMsgKey];
        const isCountdown = currentMsg.messages.some(msg => msg.author === "Tic...Tac...");

        // Supprimer ou restaurer .main et l'image
        const mainEl = document.querySelector(".main");
        if (isCountdown) {
          if (mainEl) mainEl.remove();
          if (imgEl) imgEl.style.display = "none";
        } else {
          if (!mainEl && mainElOriginal) {
            const newMain = document.createElement("div");
            newMain.className = "main";
            newMain.textContent = mainElOriginal.textContent;
            bodyEl.insertBefore(newMain, centerEl);
          }
          if (imgEl) imgEl.style.display = "block";
        }

        // Affichage des messages si c’est un nouveau
        if (!isCountdown && lastKeyDisplayed !== currentMsgKey) {
          lastKeyDisplayed = currentMsgKey;
          displayMessages(currentMsg);
        }

        // Timer
        let nextKeyStr = keys.find(k => k > currentKey);
        let diff = nextKeyStr ? new Date(nextKeyStr) - now : 0;
        if (diff < 0) diff = 0;

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (isCountdown) {
          timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
          timerEl.style.fontSize = "4vh"; // timer plus grand pendant le compte à rebours
          timerEl.style.paddingTop = "25vh";

          // Clignotement rouge/blanc
          if (!timerEl.dataset.flash) timerEl.dataset.flash = "0";
          timerEl.dataset.flash = timerEl.dataset.flash === "0" ? "1" : "0";
          timerEl.style.color = timerEl.dataset.flash === "0" ? "white" : "red";
        } else {
          timerEl.textContent = nextKeyStr
            ? `Prochain message dans ${hours}h ${minutes}m ${seconds}s`
            : "";
          timerEl.style.fontSize = "1.5vh"; // retour à taille normale
          timerEl.style.color = ""; // couleur normale
          timerEl.style.paddingTop = "0vh";
        }
      }

      update(); // premier affichage
      setInterval(update, 1000); // update chaque seconde
    })
    .catch(err => {
      console.error(err);
      titleEl.textContent = "💔";
      messageEl.textContent = "Impossible de charger les messages";
    });
});
