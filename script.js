window.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const keys = Object.keys(data).sort();
      const mainEl = document.querySelector(".main");
      const titleEl = document.getElementById("title");
      const messageEl = document.getElementById("message");
      const timerEl = document.getElementById("timer");
      const imgEl = document.querySelector(".rose");

      function getCurrentKey() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
      }

      function updateMessages() {
        const currentKey = getCurrentKey();

        let current = data[keys[0]];
        for (const key of keys) {
          if (key <= currentKey) current = data[key];
          else break;
        }

        titleEl.textContent = current.title || "";
        messageEl.innerHTML = "";

        let isTicTac = false;

        if (Array.isArray(current.messages)) {
          current.messages.forEach((msg, index) => {
            const div = document.createElement("div");
            div.classList.add("message-item");
            div.classList.add(`delay-${index + 1}`);

            const author = document.createElement("span");
            author.className = msg.class || "";

            if (msg.author === "Tic...Tac...") {
              isTicTac = true;
              author.textContent = ""; // on ne veut pas afficher de texte
            } else {
              author.textContent = `<${msg.author}>`;
            }

            const text = document.createElement("div");
            text.innerHTML = msg.text;

            div.appendChild(author);
            div.appendChild(text);

            messageEl.appendChild(div);

            if (msg.author !== "Tic...Tac..." && index < current.messages.length - 1) {
              const hr = document.createElement("hr");
              messageEl.appendChild(hr);
            }
          });
        }

        // Supprimer ou réafficher la div .main uniquement pour Tic...Tac...
        if (isTicTac && mainEl) {
          mainEl.remove(); // supprime la div .main
        } else if (!isTicTac && !document.querySelector(".main")) {
          // si ce n’est pas Tic...Tac... et que .main n’existe plus, on peut la recréer
          const newMain = document.createElement("div");
          newMain.className = "main";
          newMain.textContent = "1 jour, 1 message !";
          document.body.insertBefore(newMain, document.querySelector(".center"));
        }

        // Timer jusqu’au prochain message
        function updateTimer() {
          const now = new Date();
          const nextKeyStr = keys.find(k => k > currentKey);
          if (!nextKeyStr) {
            timerEl.textContent = "";
            return;
          }

          const nextDate = new Date(nextKeyStr);
          let diff = nextDate - now;
          if (diff < 0) diff = 0;

          const h = Math.floor(diff / 1000 / 60 / 60);
          const m = Math.floor((diff / 1000 / 60) % 60);
          const s = Math.floor((diff / 1000) % 60);

          timerEl.textContent = isTicTac ? `${h}h ${m}m ${s}s` : `Prochain message dans ${h}h ${m}m ${s}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
      }

      updateMessages();
      setInterval(updateMessages, 60 * 1000);
    })
    .catch(err => {
      console.error(err);
      titleEl.textContent = "💔";
      messageEl.textContent = "Impossible de charger les messages";
    });
});
