let activeDatabase = null;
let settings = {
  defaultSignature: "",
  defaultEmailTemplate: "clinical",
  defaultPdfBranding: { headerText: "Care Plan" }
};

/* NAVIGATION */
function showPage(id) {
  document.querySelectorAll("main .panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("headerMenu");

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("button[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      showPage(target);
      menu.classList.add("hidden");
    });
  });

  document.getElementById("goToDatabaseBtn").addEventListener("click", () => {
    showPage("databasePage");
  });

  document.getElementById("startCarePlanBtn").addEventListener("click", () => {
    showPage("carePlanPage");
  });

  document.getElementById("addResourceBtn").addEventListener("click", () => {
    showPage("resourcePage");
  });

  document.getElementById("switchDatabaseBtn").addEventListener("click", () => {
    showPage("databasePage");
  });
}

/* HOME PAGE */
function updateHomePage() {
  const noDb = document.getElementById("homeNoDbMessage");
  const content = document.getElementById("homeContent");

  if (!activeDatabase) {
    noDb.classList.remove("hidden");
    content.classList.add("hidden");
    return;
  }

  noDb.classList.add("hidden");
  content.classList.remove("hidden");

  document.getElementById("homeDbName").textContent =
    `Active Database: ${activeDatabase.name}`;
  document.getElementById("homeDbStats").textContent =
    `Topics: ${activeDatabase.topicCount}  Resources: ${activeDatabase.resourceCount}`;

  const list = document.getElementById("recentCarePlansList");
  list.innerHTML = "";
  (activeDatabase.recentCarePlans || []).forEach(cp => {
    const li = document.createElement("li");
    li.textContent = `${cp.client} — ${cp.date} — ${cp.topics} — ${cp.status}`;
    list.appendChild(li);
  });
}

/* SYSTEM STATUS */
function checkSystemStatus() {
  const icon = document.getElementById("systemStatusIcon");
  const healthList = document.getElementById("systemHealthList");
  healthList.innerHTML = "";

  const checks = [
    { name: "Backend", ok: !!window.BACKEND_STATUS_OK },
    { name: "Database", ok: !!activeDatabase },
    { name: "PDF Generator", ok: true },
    { name: "Email Sender", ok: true }
  ];

  icon.textContent = checks.every(c => c.ok) ? "✔" : "✖";

  checks.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.name}: ${c.ok ? "✔" : "✖"}`;
    healthList.appendChild(li);
  });
}

function initSystemStatusModal() {
  const popup = document.getElementById("systemStatusPopup");
  const modal = document.getElementById("systemStatusModal");
  const closeBtn = document.getElementById("closeSystemStatusModalBtn");

  popup.addEventListener("click", () => {
    checkSystemStatus();
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

/* DATABASE MANAGER */
function initDatabaseManager() {
  document.getElementById("activateDummyDbBtn").addEventListener("click", () => {
    activeDatabase = {
      name: "Apex (Primary)",
      topicCount: 12,
      resourceCount: 87,
      outputFolderId: "1Kt_2tV94NNhTLl7GRpkE6D8wlHhgiXsc",
      topicsFolderId: "1IjzDqshgZjGVaT256BicUPnu070AL2wJ",
      resourcesFolderId: "1LuLI2kgJa5pUzcnvqyKhJ8ux1tpDaH_B",
      appConfigFolderId: "1ntyRVFYhpiNWoxPle-t2PvSujnmCCa0v",
      recentCarePlans: [
        { client: "Sarah M.", date: "Jul 15", topics: "Latch, Bottle Feeding", status: "PDF, Sent" },
        { client: "Emma R.", date: "Jul 14", topics: "Pumping", status: "PDF, Sent" },
        { client: "Jacob T.", date: "Jul 13", topics: "Sleep Training", status: "PDF, Not Sent" }
      ]
    };
    updateHomePage();
    showPage("homePage");
  });

  document.getElementById("createDbBtn").addEventListener("click", async () => {
    const name = document.getElementById("newDbName").value.trim();
    const status = document.getElementById("createDbStatus");

    if (!name) {
      status.textContent = "Enter a database name.";
      return;
    }

    status.textContent = "Creating database...";

    try {
      const result = await apiCreateDatabase(name);
      activeDatabase = result.database;
      updateHomePage();
      status.textContent = "Database created.";
    } catch (e) {
      status.textContent = "Error creating database.";
    }
  });
}

/* SETTINGS */
function initSettingsPanel() {
  document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    settings.defaultSignature = document.getElementById("settingsSignatureInput").value;
    settings.defaultEmailTemplate = document.getElementById("settingsEmailTemplateSelect").value;
    settings.defaultPdfBranding.headerText =
      document.getElementById("settingsPdfHeaderInput").value;

    alert("Settings saved.");
  });
}

/* RESOURCE MODES (simple stub) */
function initResourceManager() {
  const container = document.getElementById("resourceModeContainer");

  document.getElementById("singleResourceModeBtn").addEventListener("click", () => {
    container.innerHTML = "<p>Single Resource mode (future: form to add one resource).</p>";
  });

  document.getElementById("bulkResourceModeBtn").addEventListener("click", () => {
    container.innerHTML = "<p>Bulk Upload mode (future: upload CSV or multiple files).</p>";
  });

  document.getElementById("urlResourceModeBtn").addEventListener("click", () => {
    container.innerHTML = "<p>Add URL mode (future: add external links as resources).</p>";
  });
}

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {
  initMenu();
  initSystemStatusModal();
  initDatabaseManager();
  initSettingsPanel();
  initResourceManager();
  showPage("homePage");

  try {
    const res = await pingBackend();
    window.BACKEND_STATUS_OK = true;
  } catch {
    window.BACKEND_STATUS_OK = false;
  }
});
