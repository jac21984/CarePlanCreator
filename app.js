// 🔗 Replace this with your deployed Apps Script Web App URL
const API = "https://script.google.com/macros/s/AKfycbyZNaVf_WJMsgKsyWYO-N__Fac7lBuHx7x_P2uxZ8HtvrVzsglqQ_KtWt4sFCwY4M9U2w/exec ";

// State
let selectedTopics = new Set();
let selectedResources = new Set();

// Utility: status messages
function setStatus(message, type = "info") {
  const el = document.getElementById("statusArea");
  el.textContent = message;
  el.style.color = type === "error" ? "#c0392b" : "#7b8194";
}

// Sync button
document.getElementById("syncBtn").onclick = () => {
  setStatus("Syncing resources…");

  fetch(API, {
    method: "POST",
    body: JSON.stringify({ action: "fullSync" })
  })
    .then(r => r.json())
    .then(data => {
      console.log("Sync complete:", data);
      setStatus("Resources synced successfully.");
      loadTopics(); // refresh topics after sync
    })
    .catch(err => {
      console.error(err);
      setStatus("Error syncing resources.", "error");
    });
};

// Load topics from backend
function loadTopics() {
  setStatus("Loading topics…");

  fetch(API, {
    method: "POST",
    body: JSON.stringify({ action: "getTopics" })
  })
    .then(r => r.json())
    .then(topics => {
      const container = document.getElementById("topicList");
      container.innerHTML = "";
      selectedTopics.clear();

      topics.forEach(topic => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = topic;

        chip.onclick = () => {
          if (selectedTopics.has(topic)) {
            selectedTopics.delete(topic);
            chip.classList.remove("selected");
          } else {
            selectedTopics.add(topic);
            chip.classList.add("selected");
          }
          loadResources();
        };

        container.appendChild(chip);
      });

      setStatus("Topics loaded.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Error loading topics.", "error");
    });
}

// Load resources for selected topics
function loadResources() {
  const topicsArray = Array.from(selectedTopics);
  setStatus("Loading resources…");

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "getResources",
      topics: topicsArray
    })
  })
    .then(r => r.json())
    .then(resources => {
      const container = document.getElementById("resourceList");
      container.innerHTML = "";
      selectedResources.clear();

      resources.forEach(res => {
        const card = document.createElement("div");
        card.className = "resource-card";

        card.innerHTML = `
          <div class="resource-title">${res.title || "Untitled resource"}</div>
          <div class="resource-meta">
            ${res.type || "Unknown type"} · ${res.topic || ""}
          </div>
        `;

        const key = res.id || res.title;

        card.onclick = () => {
          if (selectedResources.has(key)) {
            selectedResources.delete(key);
            card.classList.remove("selected");
          } else {
            selectedResources.add(key);
            card.classList.add("selected");
          }
        };

        container.appendChild(card);
      });

      setStatus("Resources loaded.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Error loading resources.", "error");
    });
}

// Generate PDF
document.getElementById("generatePdfBtn").onclick = () => {
  const topicsArray = Array.from(selectedTopics);
  const resourcesArray = Array.from(selectedResources);

  setStatus("Generating PDF…");

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "generatePdf",
      topics: topicsArray,
      resources: resourcesArray
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log("PDF generated:", data);
      setStatus("PDF generated successfully.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Error generating PDF.", "error");
    });
};

// Email PDF
document.getElementById("emailPdfBtn").onclick = () => {
  const topicsArray = Array.from(selectedTopics);
  const resourcesArray = Array.from(selectedResources);

  setStatus("Emailing PDF…");

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "emailPdf",
      topics: topicsArray,
      resources: resourcesArray
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log("PDF emailed:", data);
      setStatus("PDF emailed to client.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Error emailing PDF.", "error");
    });
};

// Initial load
window.onload = () => {
  loadTopics();
};
