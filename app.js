/* -------------------------------------------------------
   HAMBURGER MENU
------------------------------------------------------- */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const hamburgerOverlay = document.getElementById("hamburgerOverlay");

if (hamburgerBtn && hamburgerMenu && hamburgerOverlay) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    hamburgerOverlay.classList.toggle("active");
  });

  hamburgerOverlay.addEventListener("click", () => {
    hamburgerMenu.classList.remove("active");
    hamburgerOverlay.classList.remove("active");
  });
}

/* -------------------------------------------------------
   CRM LOGIC (only runs on client.html)
------------------------------------------------------- */
if (document.getElementById("clientList")) {

  const clients = [
    {
      id: "c1",
      name: "Sarah Martinez",
      email: "sarah@example.com",
      overview: "First‑time mom, focusing on latch and bottle introduction.",
      carePlans: [
        { title: "Initial Latch Plan", date: "2026‑07‑10", status: "Sent" },
        { title: "Bottle Introduction", date: "2026‑07‑15", status: "Draft" }
      ],
      resources: [
        { title: "Latch Video", type: "Video" },
        { title: "Bottle Feeding PDF", type: "PDF" }
      ],
      notes: "Prefers evening sessions. Baby has mild reflux."
    },
    {
      id: "c2",
      name: "Emma Roberts",
      email: "emma@example.com",
      overview: "Returning to work, pumping schedule and storage.",
      carePlans: [
        { title: "Pumping Schedule", date: "2026‑07‑08", status: "Sent" }
      ],
      resources: [
        { title: "Pumping Guide", type: "Article" }
      ],
      notes: "Needs follow‑up on workplace accommodations."
    }
  ];

  let activeClientId = null;

  /* -------------------------------------------------------
     RENDER CLIENT LIST (desktop + mobile)
  ------------------------------------------------------- */
  function renderClientList() {
    const listEl = document.getElementById("clientList");
    const mobileSelect = document.getElementById("mobileClientSelect");

    listEl.innerHTML = "";
    mobileSelect.innerHTML = "<option value=''>Select client...</option>";

    clients.forEach(client => {
      const li = document.createElement("li");
      li.textContent = client.name;
      li.dataset.clientId = client.id;
      li.addEventListener("click", () => selectClient(client.id));
      listEl.appendChild(li);

      const opt = document.createElement("option");
      opt.value = client.id;
      opt.textContent = client.name;
      mobileSelect.appendChild(opt);
    });
  }

  /* -------------------------------------------------------
     SELECT CLIENT
  ------------------------------------------------------- */
  function selectClient(id) {
    activeClientId = id;
    const client = clients.find(c => c.id === id);

    document.querySelectorAll("#clientList li").forEach(li => {
      li.classList.toggle("active", li.dataset.clientId === id);
    });

    document.getElementById("mobileClientSelect").value = id;

    document.getElementById("clientNameDisplay").textContent = client.name;
    document.getElementById("clientEmailDisplay").textContent = client.email;
    document.getElementById("clientOverviewText").textContent = client.overview;

    document.getElementById("overviewCarePlanCount").textContent = client.carePlans.length;
    document.getElementById("overviewResourceCount").textContent = client.resources.length;
    document.getElementById("overviewLastUpdated").textContent = "Today";

    renderCarePlans(client);
    renderResources(client);
    document.getElementById("clientNotesInput").value = client.notes;
  }

  /* -------------------------------------------------------
     RENDER CARE PLANS
  ------------------------------------------------------- */
  function renderCarePlans(client) {
    const list = document.getElementById("carePlanList");
    list.innerHTML = "";

    client.carePlans.forEach(plan => {
      const li = document.createElement("li");
      li.textContent = `${plan.title} — ${plan.date} (${plan.status})`;
      list.appendChild(li);
    });
  }

  /* -------------------------------------------------------
     RENDER RESOURCES
  ------------------------------------------------------- */
  function renderResources(client) {
    const list = document.getElementById("resourceList");
    list.innerHTML = "";

    client.resources.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.title} (${r.type})`;
      list.appendChild(li);
    });
  }

  /* -------------------------------------------------------
     SAVE NOTES
  ------------------------------------------------------- */
  document.getElementById("saveNotesBtn").addEventListener("click", () => {
    if (!activeClientId) return;
    const client = clients.find(c => c.id === activeClientId);
    client.notes = document.getElementById("clientNotesInput").value;
    alert("Notes saved.");
  });

  /* -------------------------------------------------------
     MOBILE SELECT HANDLER
  ------------------------------------------------------- */
  document.getElementById("mobileClientSelect").addEventListener("change", (e) => {
    if (e.target.value) selectClient(e.target.value);
  });

  /* -------------------------------------------------------
     TAB SWITCHING
  ------------------------------------------------------- */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === tab);
      });
    });
  });

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */
  renderClientList();
}