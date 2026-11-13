import { protocols, statuses } from "./data.js";

const state = document.body.dataset.state || "a";
const storageKey = "ui-npa-legacy-pilot-data";
const fields = {
  name: document.querySelector("#pilot-name"),
  email: document.querySelector("#pilot-email"),
  protocol: document.querySelector("#pilot-protocol"),
  filter: document.querySelector("#pilot-filter"),
};
const form = document.querySelector("[data-pilot-form]");
const error = document.querySelector("[data-pilot-error]");
const feedback = document.querySelector("[data-pilot-feedback]");
const rows = document.querySelector("[data-pilot-rows]");
const count = document.querySelector("[data-pilot-count]");

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function currentData() {
  return {
    name: fields.name?.value || "",
    email: fields.email?.value || "",
    protocol: fields.protocol?.value || "",
    filter: fields.filter?.value || "",
  };
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(currentData()));
}

function renderRows() {
  if (!rows) return;
  const query = (fields.filter?.value || "").trim().toLowerCase();
  const filtered = protocols.filter((protocol) => {
    const text = `${protocol.id} ${protocol.subject} ${statuses[protocol.status].label}`.toLowerCase();
    return text.includes(query);
  });

  rows.replaceChildren();
  for (const protocol of filtered) {
    const tr = document.createElement("tr");
    const id = document.createElement("td");
    id.textContent = protocol.id;
    const subject = document.createElement("td");
    subject.textContent = protocol.subject;
    const status = document.createElement("td");
    const badge = document.createElement("span");
    const meta = statuses[protocol.status];
    badge.className = state === "c" ? `iui-badge ${meta.badge}` : `legacy-status ${meta.legacy}`;
    badge.textContent = meta.label;
    status.append(badge);
    tr.append(id, subject, status);
    rows.append(tr);
  }
  if (count) count.textContent = `${filtered.length} protocolo(s)`;
}

function restore() {
  const saved = readSaved();
  for (const key of ["name", "email", "protocol", "filter"]) {
    if (fields[key] && saved[key]) fields[key].value = saved[key];
  }
  renderRows();
}

for (const key of ["name", "email", "protocol"]) {
  fields[key]?.addEventListener("input", save);
}
fields.filter?.addEventListener("input", () => {
  save();
  renderRows();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInvalid = !fields.name.value.trim();
  const emailInvalid = !fields.email.value.includes("@");

  fields.name.toggleAttribute("aria-invalid", false);
  fields.email.toggleAttribute("aria-invalid", false);
  if (nameInvalid) fields.name.setAttribute("aria-invalid", "true");
  if (emailInvalid) fields.email.setAttribute("aria-invalid", "true");

  if (nameInvalid || emailInvalid) {
    error.hidden = false;
    error.textContent = "Informe nome e e-mail institucional válido.";
    feedback.hidden = true;
    (nameInvalid ? fields.name : fields.email).focus();
    return;
  }

  error.hidden = true;
  feedback.hidden = false;
  const text = feedback.querySelector("[data-pilot-feedback-text]");
  if (text) text.textContent = `Atendimento registrado para ${fields.name.value.trim()}.`;
  save();
});

form?.querySelector("[data-pilot-reset]")?.addEventListener("click", () => {
  form.reset();
  if (fields.filter) fields.filter.value = "";
  fields.name.removeAttribute("aria-invalid");
  fields.email.removeAttribute("aria-invalid");
  error.hidden = true;
  feedback.hidden = true;
  save();
  renderRows();
  fields.name.focus();
});

restore();

const uiRegion = document.querySelector("[data-pilot-ui]");
const uiAction = document.querySelector("[data-pilot-ui-action]");
uiAction?.addEventListener("click", () => {
  const message = document.querySelector("[data-pilot-ui-feedback] p:last-child");
  if (message) message.textContent = "Mensagem atualizada no contexto legado.";
});
if (uiRegion) {
  const { applyInstitutionalIdentity } = await import("./.vendor/identity.js");
  applyInstitutionalIdentity(uiRegion, {
    municipality: {
      name: "Prefeitura Piloto",
      logo: "./assets/municipality.svg",
      logoAlt: "Marca fictícia da Prefeitura Piloto",
    },
    department: {
      name: "Secretaria de Administração",
      logo: "./assets/department.svg",
      logoAlt: "Marca fictícia da Secretaria de Administração",
    },
    sector: {
      name: "Setor de Protocolo",
      logo: "./assets/sector.svg",
      logoAlt: "Marca fictícia do Setor de Protocolo",
    },
    application: {
      name: "Sistema Legado Piloto",
      version: "3.2.0",
      developer: "NPA",
      changelog: [
        {
          version: "3.2.0",
          date: "2026-11-13",
          notes: ["Piloto de convivência entre legado e UI-NPA."],
        },
      ],
    },
    designSystem: { name: "UI-NPA", version: "0.3.2" },
  });
}
