window.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("timer");
  const titleEl = document.getElementById("title");
  const messageEl = document.getElementById("message");
  const bodyEl = document.body;
  const imgEl = document.querySelector(".rose");
  const mainElOriginal = document.querySelector(".main");

  let lastKeyDisplayed = null;

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const keys = Object.keys(data).sort();

      function displayMessages(msgData) {
        titleEl.textContent = msgData.title || "";
        messageEl.innerHTML = "";
        if (!Array.isArray(msgData.messages)) return;

        msgData.messages.forEach((msg, index) => {
          const div = document.createElement("div");
          div.classList.add("message-item", `delay-${index + 1}`);

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

      function toggleCountdown(isCountdown) {
        const skyEl = document.querySelector(".sky");
        if (isCountdown) {
          bodyEl.style.background = "black";
          if (skyEl) skyEl.style.display = "none";
          bodyEl.classList.add("countdown");
          if (mainElOriginal) mainElOriginal.style.display = "none";
          if (imgEl) imgEl.style.display = "none";
        } else {
          bodyEl.style.background = "";
          if (skyEl) skyEl.style.display = "block";
          bodyEl.classList.remove("countdown");
          if (mainElOriginal) mainElOriginal.style.display = "flex";
          if (imgEl) imgEl.style.display = "block";
        }
      }

      function update() {
        const now = new Date();

        // Trouver le dernier message passé
        let currentMsgKey = keys[0];
        for (const key of keys) {
          if (new Date(key) <= now) currentMsgKey = key;
          else break;
        }

        const currentMsg = data[currentMsgKey];
        const isCountdown = currentMsg.messages.some(msg => msg.author === "Tic...Tac...");

        toggleCountdown(isCountdown);

        if (!isCountdown && lastKeyDisplayed !== currentMsgKey) {
          lastKeyDisplayed = currentMsgKey;
          displayMessages(currentMsg);
        }

        // Timer
        const nextKeyStr = keys.find(k => new Date(k) > now);
        let diff = nextKeyStr ? new Date(nextKeyStr) - now : 0;

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (isCountdown) {
          timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
          timerEl.style.fontSize = "5.5vh";
          timerEl.style.paddingTop = "25vh";
          timerEl.style.color = seconds % 2 === 0 ? "red" : "white";
        } else {
          timerEl.textContent = nextKeyStr
            ? `Prochain message dans ${hours}h ${minutes}m ${seconds}s`
            : "Aucun message à venir";
          timerEl.style.fontSize = "1.5vh";
          timerEl.style.color = "white";
          timerEl.style.paddingTop = "0vh";
        }
      }

      update();
      setInterval(update, 1000);
    })
    .catch(err => {
      console.error(err);
      titleEl.textContent = "💔";
      messageEl.textContent = "Impossible de charger les messages";
    });
});
