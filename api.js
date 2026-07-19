const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxwYF8oWn07BfvU2A_xAImTaiXDdkxN7geMIo4sERoiI2WRirDlvzqgQzTpzVRM58_gHg/exec";

async function pingBackend() {
  const res = await fetch(BACKEND_URL);
  if (!res.ok) throw new Error("Backend error");
  return res.json();
}

async function apiCreateDatabase(name) {
  const payload = {
    action: "createDatabase",
    name
  };

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function apiGenerateCarePlanPdf(clientInfo, selectedResources, settings) {
  const payload = {
    action: "generateCarePlanPdf",
    clientInfo,
    selectedResources,
    settings
  };

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function apiSendCarePlanEmail(pdfFileId, clientEmail, settings) {
  const payload = {
    action: "sendCarePlanEmail",
    pdfFileId,
    clientEmail,
    settings
  };

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
