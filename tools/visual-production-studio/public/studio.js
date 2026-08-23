// CC-11.5: ALP Visual Production Studio client. Plain vanilla JS, no
// build step, no framework -- fetches from the local-only API server
// (server.ts) and renders the catalogue/state it returns.

const FILTERS = [
  { id: "all", label: "All" },
  { id: "P0", label: "P0" },
  { id: "P1", label: "P1" },
  { id: "P2", label: "P2" },
  { id: "teaching", label: "Teaching illustration" },
  { id: "hybrid", label: "Hybrid" },
  { id: "deterministic-polish", label: "Deterministic/polish" },
  { id: "conceptual", label: "Conceptual" },
  { id: "approved", label: "Approved" },
  { id: "outstanding", label: "Outstanding" },
];

const STATUS_BUCKET = {
  REFERENCE_NOT_READY: "blocked",
  BLOCKED: "blocked",
  READY_TO_PROMPT: "not-started",
  IN_ART_SESSION: "in-progress",
  IMAGE_PASTED: "in-progress",
  NEEDS_REVIEW: "needs-review",
  APPROVED: "approved",
  SAVED: "approved",
  SUPERSEDED: "approved",
};

const STATUS_BADGE_CLASS = {
  REFERENCE_NOT_READY: "status-not-ready",
  BLOCKED: "status-blocked",
  READY_TO_PROMPT: "status-ready",
  IN_ART_SESSION: "status-progress",
  IMAGE_PASTED: "status-progress",
  NEEDS_REVIEW: "status-review",
  APPROVED: "status-approved",
  SAVED: "status-approved",
  SUPERSEDED: "status-approved",
};

let catalogue = [];
let studioState = {};
let manifestCurrent = {};
let activeFilter = localStorage.getItem("alp-studio-filter") || "all";
let stagedPreview = {}; // assetId -> { file, objectUrl }

function $(selector, root = document) {
  return root.querySelector(selector);
}

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.error || JSON.stringify(body);
    } catch {
      // ignore
    }
    const error = new Error(detail);
    error.status = res.status;
    error.body = detail;
    throw error;
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

async function copyToClipboard(text, flashEl) {
  await navigator.clipboard.writeText(text);
  if (flashEl) {
    flashEl.classList.add("show");
    setTimeout(() => flashEl.classList.remove("show"), 1200);
  }
}

function flashConflict(message) {
  window.alert(message);
}

// ---------------------------------------------------------------------
// Progress summary
// ---------------------------------------------------------------------

function renderProgress() {
  const buckets = { total: 0, "not-started": 0, "in-progress": 0, approved: 0, "needs-review": 0, blocked: 0 };
  for (const entry of catalogue) {
    buckets.total += 1;
    const status = studioState[entry.assetId]?.status;
    const bucket = STATUS_BUCKET[status] || "not-started";
    buckets[bucket] += 1;
  }
  $("#stat-total").textContent = buckets.total;
  $("#stat-not-started").textContent = buckets["not-started"];
  $("#stat-in-progress").textContent = buckets["in-progress"];
  $("#stat-approved").textContent = buckets.approved;
  $("#stat-needs-review").textContent = buckets["needs-review"];
  $("#stat-blocked").textContent = buckets.blocked;
}

// ---------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------

function entryMatchesFilter(entry, filterId) {
  if (filterId === "all") return true;
  if (filterId === "P0" || filterId === "P1" || filterId === "P2") return entry.priority === filterId;
  if (filterId === "teaching" || filterId === "hybrid" || filterId === "deterministic-polish" || filterId === "conceptual") {
    return entry.outputSubfolder === filterId;
  }
  const status = studioState[entry.assetId]?.status;
  if (filterId === "approved") return STATUS_BUCKET[status] === "approved";
  if (filterId === "outstanding") return STATUS_BUCKET[status] !== "approved";
  return true;
}

function renderFilters() {
  const container = $("#filters");
  container.innerHTML = "";
  for (const filter of FILTERS) {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (filter.id === activeFilter ? " active" : "");
    btn.textContent = filter.label;
    btn.addEventListener("click", () => {
      activeFilter = filter.id;
      localStorage.setItem("alp-studio-filter", activeFilter);
      renderFilters();
      applyFilter();
    });
    container.appendChild(btn);
  }
}

function applyFilter() {
  for (const card of document.querySelectorAll(".card")) {
    const assetId = card.dataset.assetId;
    const entry = catalogue.find((item) => item.assetId === assetId);
    card.classList.toggle("filtered-out", !entryMatchesFilter(entry, activeFilter));
  }
}

// ---------------------------------------------------------------------
// Next recommended asset
// ---------------------------------------------------------------------

async function refreshNextAsset() {
  const { assetId } = await api("/api/next");
  const nameEl = $("#next-asset-name");
  const copyBtn = $("#btn-copy-next");
  if (!assetId) {
    nameEl.textContent = "Nothing actionable right now.";
    copyBtn.disabled = true;
    copyBtn.dataset.assetId = "";
    return;
  }
  const entry = catalogue.find((item) => item.assetId === assetId);
  nameEl.textContent = `${entry.sequence.toString().padStart(2, "0")} — ${entry.displayName}`;
  copyBtn.disabled = false;
  copyBtn.dataset.assetId = assetId;
}

async function copyNextPrompt() {
  const assetId = $("#btn-copy-next").dataset.assetId;
  if (!assetId) return;
  const { text } = await api(`/api/prompt/${encodeURIComponent(assetId)}`);
  await copyToClipboard(text, $("#next-copied-flash"));
  const card = document.querySelector(`.card[data-asset-id="${CSS.escape(assetId)}"]`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.querySelector(".paste-zone").focus();
  }
}

// ---------------------------------------------------------------------
// Card rendering
// ---------------------------------------------------------------------

function fillList(ul, items) {
  ul.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  }
}

function renderCard(entry) {
  const template = $("#asset-card-template");
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.assetId = entry.assetId;

  card.querySelector(".card-seq").textContent = "#" + entry.sequence.toString().padStart(2, "0");
  card.querySelector(".card-name").textContent = entry.displayName;
  card.querySelector(".asset-id").textContent = entry.assetId;
  card.querySelector(".lo").textContent = entry.loOrLesson || "LO/lesson: n/a";
  card.querySelector(".priority").textContent = "Priority " + entry.priorityLabel;
  card.querySelector(".production-class").textContent = entry.productionClassLabel;
  card.querySelector(".current-family").textContent = entry.currentFamily ? "family: " + entry.currentFamily : "no existing family";
  card.querySelector(".purpose").textContent = entry.instructionalPurpose;

  card.querySelector(".reference-source").textContent = entry.primaryReference.sourceName;
  const link = card.querySelector(".reference-link");
  if (entry.primaryReference.sourceUrl) {
    link.href = entry.primaryReference.sourceUrl;
  } else {
    link.style.display = "none";
  }
  card.querySelector(".reference-licence").textContent = "Licence: " + entry.primaryReference.licence;
  card.querySelector(".reference-grade").textContent = "Quality grade: " + entry.primaryReference.qualityGrade;

  fillList(card.querySelector(".fact-immutable"), entry.immutableFacts);
  fillList(card.querySelector(".fact-creative"), entry.creativeFreedoms);
  fillList(card.querySelector(".fact-overlay"), entry.deterministicOverlayResponsibilities);
  fillList(card.querySelector(".fact-prohibited"), entry.prohibitedChanges);

  card.querySelector(".output-filename").textContent = entry.filenameBase + "-v{N}." + "(png|webp|jpg)";
  card.querySelector(".output-path").textContent = `apps/mobile/src/assets/instructional/unit202/${entry.outputSubfolder}/`;

  wireCardControls(card, entry);
  updateCardStatus(card, entry);

  return card;
}

function updateCardStatus(card, entry) {
  const status = studioState[entry.assetId]?.status || "READY_TO_PROMPT";
  const badge = card.querySelector(".status-badge");
  badge.textContent = status.replace(/_/g, " ");
  badge.className = "badge status-badge " + (STATUS_BADGE_CLASS[status] || "");

  const current = manifestCurrent[entry.assetId];
  const openSavedBtn = card.querySelector(".btn-open-saved");
  openSavedBtn.disabled = !current;
  const approveBtn = card.querySelector(".btn-approve-save");
  const hasStagedPreview = Boolean(stagedPreview[entry.assetId]) || status === "IMAGE_PASTED";
  approveBtn.disabled = entry.referenceReadiness !== "READY" || !hasStagedPreview;
}

function setPastePreview(card, entry, file) {
  const zone = card.querySelector(".paste-zone");
  const emptyEl = zone.querySelector(".paste-zone-empty");
  const img = zone.querySelector(".paste-preview");
  const previous = stagedPreview[entry.assetId];
  if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl);

  const objectUrl = URL.createObjectURL(file);
  stagedPreview[entry.assetId] = { file, objectUrl };
  img.src = objectUrl;
  img.hidden = false;
  emptyEl.hidden = true;
}

function clearPastePreview(card, entry) {
  const zone = card.querySelector(".paste-zone");
  const emptyEl = zone.querySelector(".paste-zone-empty");
  const img = zone.querySelector(".paste-preview");
  const previous = stagedPreview[entry.assetId];
  if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl);
  delete stagedPreview[entry.assetId];
  img.hidden = true;
  img.removeAttribute("src");
  emptyEl.hidden = false;
}

async function uploadPastedImage(card, entry, file) {
  setPastePreview(card, entry, file);
  const info = await api(`/api/paste/${encodeURIComponent(entry.assetId)}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  card.querySelector(".paste-info").textContent =
    `${info.format.toUpperCase()} · ${info.width || "?"}×${info.height || "?"} · ${info.approxSize}` +
    (info.hasAlpha === null ? "" : info.hasAlpha ? " · transparency detected" : " · no transparency detected");
  studioState[entry.assetId] = { status: "IMAGE_PASTED", updatedAt: new Date().toISOString() };
  updateCardStatus(card, entry);
  renderProgress();
}

async function approveAndSave(card, entry, versioning) {
  try {
    const body = versioning ? { versioning } : {};
    const result = await api(`/api/approve/${encodeURIComponent(entry.assetId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    manifestCurrent[entry.assetId] = result.manifestEntry;
    studioState[entry.assetId] = { status: "SAVED", updatedAt: new Date().toISOString() };
    card.querySelector(".conflict-panel").hidden = true;
    updateCardStatus(card, entry);
    renderProgress();
    window.alert(`Saved: ${result.outputPath}`);
  } catch (error) {
    if (error.status === 409) {
      card.querySelector(".conflict-panel").hidden = false;
    } else {
      flashConflict("Save failed: " + error.message);
    }
  }
}

function wireCardControls(card, entry) {
  const zone = card.querySelector(".paste-zone");
  const fileInput = card.querySelector(".file-input");
  const promptView = card.querySelector(".prompt-view");
  const flash = card.querySelector(".card-copied-flash");

  zone.addEventListener("click", () => zone.focus());
  zone.addEventListener("dblclick", () => fileInput.click());
  zone.addEventListener("paste", (event) => {
    const items = event.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) void uploadPastedImage(card, entry, file);
        event.preventDefault();
        return;
      }
    }
  });
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) void uploadPastedImage(card, entry, file);
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) void uploadPastedImage(card, entry, file);
  });

  card.querySelector(".paste-preview").addEventListener("click", (event) => {
    event.target.classList.toggle("zoomed");
  });

  card.querySelector(".btn-view-prompt").addEventListener("click", async () => {
    if (promptView.hidden) {
      const { text } = await api(`/api/prompt/${encodeURIComponent(entry.assetId)}`);
      promptView.textContent = text;
      promptView.hidden = false;
    } else {
      promptView.hidden = true;
    }
  });

  card.querySelector(".btn-copy-prompt").addEventListener("click", async () => {
    const { text } = await api(`/api/prompt/${encodeURIComponent(entry.assetId)}`);
    await copyToClipboard(text, flash);
    zone.focus();
  });

  card.querySelector(".btn-open-reference").addEventListener("click", () => {
    if (entry.primaryReference.sourceUrl) window.open(entry.primaryReference.sourceUrl, "_blank", "noopener");
  });

  card.querySelector(".btn-needs-review").addEventListener("click", async () => {
    const notes = card.querySelector(".notes-box").value;
    await api(`/api/status/${encodeURIComponent(entry.assetId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "NEEDS_REVIEW", notes }),
    });
    studioState[entry.assetId] = { status: "NEEDS_REVIEW", notes, updatedAt: new Date().toISOString() };
    updateCardStatus(card, entry);
    renderProgress();
  });

  card.querySelector(".btn-approve-save").addEventListener("click", () => approveAndSave(card, entry, undefined));
  card.querySelector(".conflict-cancel").addEventListener("click", () => {
    card.querySelector(".conflict-panel").hidden = true;
  });
  card.querySelector(".conflict-new-version").addEventListener("click", () => approveAndSave(card, entry, "new_version"));
  card.querySelector(".conflict-replace").addEventListener("click", () => {
    if (window.confirm("Replace the current approved version in place? This overwrites the existing file.")) {
      void approveAndSave(card, entry, "replace_confirmed");
    }
  });

  card.querySelector(".btn-replace-image").addEventListener("click", () => {
    clearPastePreview(card, entry);
    zone.focus();
  });

  card.querySelector(".btn-open-saved").addEventListener("click", async () => {
    await api(`/api/open-file/${encodeURIComponent(entry.assetId)}`, { method: "POST" });
  });
}

// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------

async function loadAll() {
  catalogue = await api("/api/catalogue");
  const stateResponse = await api("/api/state");
  studioState = stateResponse.state;
  manifestCurrent = stateResponse.manifestCurrent;
}

function renderGrid() {
  const grid = $("#asset-grid");
  grid.innerHTML = "";
  for (const entry of catalogue) {
    grid.appendChild(renderCard(entry));
  }
  applyFilter();
}

async function main() {
  await loadAll();
  renderProgress();
  renderFilters();
  renderGrid();
  await refreshNextAsset();

  $("#btn-copy-master").addEventListener("click", async () => {
    const { text } = await api("/api/master-prompt");
    await copyToClipboard(text, $("#master-copied-flash"));
  });
  $("#btn-open-chatgpt").addEventListener("click", () => {
    window.open("https://chatgpt.com/", "_blank", "noopener");
  });
  $("#btn-copy-next").addEventListener("click", copyNextPrompt);
  $("#btn-contact-sheet").addEventListener("click", () => {
    window.open("/api/contact-sheet", "_blank", "noopener");
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
    if (isTyping) return;
    if (event.key === "n" || event.key === "N") {
      event.preventDefault();
      void copyNextPrompt();
    }
  });
}

main().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<div style="background:#ff6b6b;color:#000;padding:10px;">Studio failed to load: ${error.message}</div>`);
});
