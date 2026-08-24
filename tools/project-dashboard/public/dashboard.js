function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

async function renderRoadmap() {
  const res = await fetch("/api/roadmap");
  const items = await res.json();

  const current = items.find((i) => i.isCurrentPosition);
  const posEl = document.getElementById("current-position");
  if (current) {
    posEl.innerHTML = `<strong>Current position:</strong> ${escapeHtml(current.label)} -- ${escapeHtml(current.notes ?? "")}`;
  }

  const rows = items
    .map((item) => {
      const cls = ["kind-" + item.kind, item.isCurrentPosition ? "current" : ""].join(" ");
      return `<tr class="${cls}">
        <td>${escapeHtml(item.label)}</td>
        <td><span class="badge badge-${item.status}">${item.status.replace("_", " ")}</span></td>
        <td>${item.dependsOn.length ? item.dependsOn.join(", ") : "&mdash;"}</td>
        <td class="gate">${item.gate ? escapeHtml(item.gate) : ""}</td>
        <td class="notes">${item.evidence ? escapeHtml(item.evidence) + "<br/>" : ""}${item.notes ? escapeHtml(item.notes) : ""}</td>
      </tr>`;
    })
    .join("");

  document.getElementById("roadmap-table").innerHTML = `
    <table>
      <thead><tr><th>Item</th><th>Status</th><th>Depends on</th><th>Gate</th><th>Evidence / notes</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

let flowRendered = false;

async function renderFlow() {
  // Mermaid must lay out into a visible element -- this is only ever called
  // after the flow tab's "active" class has made #flow-diagram visible, never
  // eagerly at page load (a hidden display:none container fails layout and
  // mermaid reports a misleading "Syntax error in text").
  if (flowRendered) return;
  flowRendered = true;
  const res = await fetch("/api/platform-flow");
  const { mermaid: source } = await res.json();
  const container = document.getElementById("flow-diagram");
  container.innerHTML = `<pre class="mermaid">${escapeHtml(source)}</pre>`;
  if (window.mermaid) {
    window.mermaid.initialize({ startOnLoad: false, theme: "dark" });
    await window.mermaid.run({ nodes: [container.querySelector(".mermaid")] });
  }
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "flow") renderFlow();
    });
  });
}

setupTabs();
renderRoadmap();
