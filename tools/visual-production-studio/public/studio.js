// CC-11.5/CC-11.6: ALP Visual Production Studio client. Plain vanilla JS,
// no build step, no framework -- fetches from the local-only API server
// (server.ts) and renders the FAMILY-grouped catalogue it returns.
//
// A VisualFamily is an organisational grouping only -- it never reduces
// prompt granularity. Every individual asset, even one nested inside a
// multi-asset family, gets its own fully-rendered card with its own
// independent [COPY PROMPT] / [VIEW PROMPT] / paste-drop / approve-save
// controls. Grouping only changes how cards are visually organised on
// the page (collapsible family sections), never how many prompts exist.

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
  SCOPE_CONFIRMATION_NEEDED: "blocked",
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
  SCOPE_CONFIRMATION_NEEDED: "status-not-ready",
  BLOCKED: "status-blocked",
  READY_TO_PROMPT: "status-ready",
  IN_ART_SESSION: "status-progress",
  IMAGE_PASTED: "status-progress",
  NEEDS_REVIEW: "status-review",
  APPROVED: "status-approved",
  SAVED: "status-approved",
  SUPERSEDED: "status-approved",
};

let families = []; // VisualFamily[], each with .assets (VisualAsset[]) -- as returned by /api/catalogue
let catalogue = []; // flat allAssets(), derived client-side for per-asset lookups
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

function isPromptable(asset) {
  return asset.referenceReadiness === "READY" && !asset.needsScopeConfirmation && asset.promptable !== false;
}

// ---------------------------------------------------------------------
// Prompt accounting (family count / asset count / promptable count)
// ---------------------------------------------------------------------

function renderPromptAccounting() {
  const promptableCount = catalogue.filter(isPromptable).length;
  $("#prompt-accounting").textContent = `${families.length} visual families · ${catalogue.length} individual assets · ${promptableCount} promptable artwork assets`;
}

// ---------------------------------------------------------------------
// Progress summary
// ---------------------------------------------------------------------

function renderProgress() {
  const buckets = { "not-started": 0, "in-progress": 0, approved: 0, "needs-review": 0, blocked: 0 };
  for (const asset of catalogue) {
    const status = studioState[asset.assetId]?.status;
    const bucket = STATUS_BUCKET[status] || "not-started";
    buckets[bucket] += 1;
  }
  $("#stat-not-started").textContent = buckets["not-started"];
  $("#stat-in-progress").textContent = buckets["in-progress"];
  $("#stat-approved").textContent = buckets.approved;
  $("#stat-needs-review").textContent = buckets["needs-review"];
  $("#stat-blocked").textContent = buckets.blocked;
}

/** CC-11.7 §19: the comprehensive-catalogue dashboard -- distinct counts, never one misleading total. */
async function renderDashboard() {
  const d = await api("/api/dashboard");
  $("#dash-families").textContent = d.visualFamilies;
  $("#dash-assets").textContent = d.productionBaseAssets;
  $("#dash-states").textContent = d.canonicalLearnerVisibleStates;
  $("#dash-required").textContent = d.required;
  $("#dash-useful").textContent = d.usefulTrackedNotCatalogued;
  $("#dash-deterministic").textContent = d.deterministicOnly;
  $("#dash-artjobs").textContent = d.premiumHybridArtJobs;
  $("#dash-approved").textContent = d.approved;
  $("#dash-outstanding").textContent = d.outstanding;
  $("#dash-blocked").textContent = d.blockedReference;
  $("#dash-deferred").textContent = d.deferredScope;
  $("#dash-superseded").textContent = d.superseded;
}

// ---------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------

function assetMatchesFilter(asset, filterId) {
  if (filterId === "all") return true;
  if (filterId === "P0" || filterId === "P1" || filterId === "P2") return asset.priority === filterId;
  if (filterId === "teaching" || filterId === "hybrid" || filterId === "deterministic-polish" || filterId === "conceptual") {
    return asset.outputSubfolder === filterId;
  }
  const status = studioState[asset.assetId]?.status;
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
  for (const section of document.querySelectorAll(".family-section")) {
    let visibleCount = 0;
    for (const card of section.querySelectorAll(".card")) {
      const assetId = card.dataset.assetId;
      const asset = catalogue.find((item) => item.assetId === assetId);
      const matches = assetMatchesFilter(asset, activeFilter);
      card.classList.toggle("filtered-out", !matches);
      if (matches) visibleCount += 1;
    }
    section.classList.toggle("filtered-out", visibleCount === 0);
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
  const asset = catalogue.find((item) => item.assetId === assetId);
  nameEl.textContent = `${asset.sequence.toString().padStart(2, "0")} — ${asset.displayName}`;
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
// Family section + card rendering
// ---------------------------------------------------------------------

function fillList(ul, items) {
  ul.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  }
}

function familyApprovedCount(family) {
  return family.assets.filter((asset) => {
    const status = studioState[asset.assetId]?.status;
    return STATUS_BUCKET[status] === "approved";
  }).length;
}

function renderCard(asset) {
  const template = $("#asset-card-template");
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.assetId = asset.assetId;

  card.querySelector(".card-seq").textContent = "#" + asset.sequence.toString().padStart(2, "0");
  card.querySelector(".card-name").textContent = asset.displayName;
  card.querySelector(".asset-id").textContent = asset.assetId;
  card.querySelector(".role").textContent = asset.role;
  card.querySelector(".lo").textContent = asset.loOrLesson || "LO/lesson: n/a";
  card.querySelector(".priority").textContent = "Priority " + asset.priorityLabel;
  card.querySelector(".production-class").textContent = asset.productionClassLabel;
  card.querySelector(".governed-blueprint").textContent = asset.governedDiagramBlueprintId ? "blueprint: " + asset.governedDiagramBlueprintId : "no existing blueprint";
  card.querySelector(".annotation-policy").textContent = "labels: " + asset.annotationPolicy.replace(/_/g, " ");
  card.querySelector(".purpose").textContent = asset.instructionalPurpose;

  card.querySelector(".reference-source").textContent = asset.primaryReference.sourceName;
  const link = card.querySelector(".reference-link");
  if (asset.primaryReference.sourceUrl) {
    link.href = asset.primaryReference.sourceUrl;
  } else {
    link.style.display = "none";
  }
  card.querySelector(".reference-licence").textContent = "Licence: " + asset.primaryReference.licence;
  card.querySelector(".reference-grade").textContent = "Quality grade: " + asset.primaryReference.qualityGrade;

  fillList(card.querySelector(".fact-immutable"), asset.requiredLabels && asset.requiredLabels.length ? asset.immutableFacts.concat(asset.requiredLabels.map((l) => "LABEL: " + l)) : asset.immutableFacts);
  fillList(card.querySelector(".fact-creative"), asset.creativeFreedoms);
  fillList(card.querySelector(".fact-overlay"), asset.deterministicOverlayResponsibilities);
  fillList(card.querySelector(".fact-prohibited"), asset.prohibitedChanges);

  card.querySelector(".output-filename").textContent = asset.filenameBase + "-v{N}." + "(png|webp|jpg)";
  card.querySelector(".output-path").textContent = `apps/mobile/src/assets/instructional/unit202/${asset.outputSubfolder}/`;

  wireCardControls(card, asset);
  updateCardStatus(card, asset);

  return card;
}

function updateCardStatus(card, asset) {
  const status = studioState[asset.assetId]?.status || "READY_TO_PROMPT";
  const badge = card.querySelector(".status-badge");
  badge.textContent = status.replace(/_/g, " ");
  badge.className = "badge status-badge " + (STATUS_BADGE_CLASS[status] || "");

  const current = manifestCurrent[asset.assetId];
  const openSavedBtn = card.querySelector(".btn-open-saved");
  openSavedBtn.disabled = !current;
  const approveBtn = card.querySelector(".btn-approve-save");
  const hasStagedPreview = Boolean(stagedPreview[asset.assetId]) || status === "IMAGE_PASTED";
  approveBtn.disabled = !isPromptable(asset) || !hasStagedPreview;

  const pasteZone = card.querySelector(".paste-zone");
  pasteZone.classList.toggle("disabled-zone", !isPromptable(asset));
}

function setPastePreview(card, asset, file) {
  const zone = card.querySelector(".paste-zone");
  const emptyEl = zone.querySelector(".paste-zone-empty");
  const img = zone.querySelector(".paste-preview");
  const previous = stagedPreview[asset.assetId];
  if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl);

  const objectUrl = URL.createObjectURL(file);
  stagedPreview[asset.assetId] = { file, objectUrl };
  img.src = objectUrl;
  img.hidden = false;
  emptyEl.hidden = true;
}

function clearPastePreview(card, asset) {
  const zone = card.querySelector(".paste-zone");
  const emptyEl = zone.querySelector(".paste-zone-empty");
  const img = zone.querySelector(".paste-preview");
  const previous = stagedPreview[asset.assetId];
  if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl);
  delete stagedPreview[asset.assetId];
  img.hidden = true;
  img.removeAttribute("src");
  emptyEl.hidden = false;
}

async function uploadPastedImage(card, asset, file) {
  setPastePreview(card, asset, file);
  const info = await api(`/api/paste/${encodeURIComponent(asset.assetId)}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  card.querySelector(".paste-info").textContent =
    `${info.format.toUpperCase()} · ${info.width || "?"}×${info.height || "?"} · ${info.approxSize}` +
    (info.hasAlpha === null ? "" : info.hasAlpha ? " · transparency detected" : " · no transparency detected");
  studioState[asset.assetId] = { status: "IMAGE_PASTED", updatedAt: new Date().toISOString() };
  updateCardStatus(card, asset);
  renderProgress();
}

async function approveAndSave(card, asset, versioning) {
  try {
    const body = versioning ? { versioning } : {};
    const result = await api(`/api/approve/${encodeURIComponent(asset.assetId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    manifestCurrent[asset.assetId] = result.manifestEntry;
    studioState[asset.assetId] = { status: "SAVED", updatedAt: new Date().toISOString() };
    card.querySelector(".conflict-panel").hidden = true;
    updateCardStatus(card, asset);
    renderProgress();
    renderFamilyProgressBadges();
    void renderDashboard();
    window.alert(`Saved: ${result.outputPath}`);
  } catch (error) {
    if (error.status === 409) {
      card.querySelector(".conflict-panel").hidden = false;
    } else {
      flashConflict("Save failed: " + error.message);
    }
  }
}

function wireCardControls(card, asset) {
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
        if (file) void uploadPastedImage(card, asset, file);
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
    if (file && file.type.startsWith("image/")) void uploadPastedImage(card, asset, file);
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) void uploadPastedImage(card, asset, file);
  });

  card.querySelector(".paste-preview").addEventListener("click", (event) => {
    event.target.classList.toggle("zoomed");
  });

  card.querySelector(".btn-view-prompt").addEventListener("click", async () => {
    if (promptView.hidden) {
      const { text } = await api(`/api/prompt/${encodeURIComponent(asset.assetId)}`);
      promptView.textContent = text;
      promptView.hidden = false;
    } else {
      promptView.hidden = true;
    }
  });

  card.querySelector(".btn-copy-prompt").addEventListener("click", async () => {
    const { text } = await api(`/api/prompt/${encodeURIComponent(asset.assetId)}`);
    await copyToClipboard(text, flash);
    zone.focus();
  });

  card.querySelector(".btn-open-reference").addEventListener("click", () => {
    if (asset.primaryReference.sourceUrl) window.open(asset.primaryReference.sourceUrl, "_blank", "noopener");
  });

  card.querySelector(".btn-needs-review").addEventListener("click", async () => {
    const notes = card.querySelector(".notes-box").value;
    await api(`/api/status/${encodeURIComponent(asset.assetId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "NEEDS_REVIEW", notes }),
    });
    studioState[asset.assetId] = { status: "NEEDS_REVIEW", notes, updatedAt: new Date().toISOString() };
    updateCardStatus(card, asset);
    renderProgress();
  });

  card.querySelector(".btn-approve-save").addEventListener("click", () => approveAndSave(card, asset, undefined));
  card.querySelector(".conflict-cancel").addEventListener("click", () => {
    card.querySelector(".conflict-panel").hidden = true;
  });
  card.querySelector(".conflict-new-version").addEventListener("click", () => approveAndSave(card, asset, "new_version"));
  card.querySelector(".conflict-replace").addEventListener("click", () => {
    if (window.confirm("Replace the current approved version in place? This overwrites the existing file.")) {
      void approveAndSave(card, asset, "replace_confirmed");
    }
  });

  card.querySelector(".btn-replace-image").addEventListener("click", () => {
    clearPastePreview(card, asset);
    zone.focus();
  });

  card.querySelector(".btn-open-saved").addEventListener("click", async () => {
    await api(`/api/open-file/${encodeURIComponent(asset.assetId)}`, { method: "POST" });
  });
}

function renderFamilySection(family) {
  const template = $("#family-section-template");
  const section = template.content.firstElementChild.cloneNode(true);
  section.dataset.familyId = family.familyId;

  section.querySelector(".family-name").textContent = family.displayName;
  section.querySelector(".family-count").textContent = `${family.assets.length} visual asset${family.assets.length === 1 ? "" : "s"}`;
  section.querySelector(".family-purpose").textContent = family.instructionalPurpose;
  if (family.familyNotes) section.querySelector(".family-notes").textContent = family.familyNotes;

  const grid = section.querySelector(".asset-grid");
  for (const asset of family.assets) grid.appendChild(renderCard(asset));

  return section;
}

function renderFamilyProgressBadges() {
  for (const section of document.querySelectorAll(".family-section")) {
    const family = families.find((f) => f.familyId === section.dataset.familyId);
    if (!family) continue;
    const approved = familyApprovedCount(family);
    section.querySelector(".family-progress").textContent = `[${approved}/${family.assets.length} approved]`;
  }
}

// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------

async function loadAll() {
  families = await api("/api/catalogue");
  catalogue = families.flatMap((family) => family.assets);
  const stateResponse = await api("/api/state");
  studioState = stateResponse.state;
  manifestCurrent = stateResponse.manifestCurrent;
}

function renderFamilyList() {
  const list = $("#family-list");
  list.innerHTML = "";
  for (const family of families) {
    list.appendChild(renderFamilySection(family));
  }
  renderFamilyProgressBadges();
  applyFilter();
}

async function main() {
  await loadAll();
  renderPromptAccounting();
  renderProgress();
  void renderDashboard();
  renderFilters();
  renderFamilyList();
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
