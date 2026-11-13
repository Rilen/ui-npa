import { applyInstitutionalIdentity } from "../../packages/styles/identity.js";
import { mountSidebar } from "../../packages/styles/sidebar.js";

const sidebar = document.querySelector("#sidebar");
const storageKey = "ui-npa-demo-sidebar";

if (!sidebar) {
  throw new Error("Sidebar da demonstração não encontrada.");
}

applyInstitutionalIdentity(document.querySelector(".iui-shell"), {
  municipality: {
    name: "Prefeitura Municipal de Exemplo",
    logo: "./assets/prefeitura.svg",
    logoAlt: "Marca de demonstração da Prefeitura Municipal de Exemplo",
  },
  department: {
    name: "Secretaria Municipal de Exemplo",
    logo: "./assets/secretaria.svg",
    logoAlt: "Marca de demonstração da Secretaria Municipal de Exemplo",
  },
  sector: {
    name: "Setor de Atendimento",
    logo: "./assets/setor.svg",
    logoAlt: "Marca de demonstração do Setor de Atendimento",
  },
  application: {
    name: "Gestão de Requerimentos",
    version: "1.4.0",
    developer: "NPA",
    changelog: [
      {
        version: "1.4.0",
        date: "2026-11-12",
        notes: ["Registro sintético do contrato de novidades. Não descreve uma publicação real."],
      },
      {
        version: "1.3.0",
        date: "2026-08-01",
        notes: ["Exemplo sintético de versão anterior, apenas para demonstrar a lista."],
      },
    ],
  },
  designSystem: {
    name: "UI-NPA",
    version: "0.3.1",
  },
});

mountSidebar(sidebar, {
  toggle: document.querySelector("[data-iui-sidebar-toggle]"),
  backdrop: document.querySelector(".iui-shell__backdrop"),
  content: document.querySelector(".iui-shell__content"),
  storage: {
    get() {
      return localStorage.getItem(storageKey);
    },
    set(value) {
      localStorage.setItem(storageKey, value);
    },
  },
});

const links = [...document.querySelectorAll(".iui-sidebar__link")];
const sections = [...document.querySelectorAll("[data-iui-section]")];

function showSection() {
  const hash = window.location.hash;
  const known = sections.some((section) => `#${section.id}` === hash);
  const current = known ? hash : "#painel";
  for (const section of sections) {
    section.hidden = `#${section.id}` !== current;
  }
  for (const link of links) {
    if (link.getAttribute("href") === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  document.querySelector(".iui-shell__content")?.scrollTo(0, 0);
}

window.addEventListener("hashchange", showSection);
showSection();

const search = document.querySelector("#pesquisa");
const rows = [...document.querySelectorAll("[data-iui-row]")];
const count = document.querySelector("[data-iui-count]");

function applyFilter() {
  const query = search.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  for (const row of rows) {
    const match = row.dataset.iuiRow.toLocaleLowerCase("pt-BR").includes(query);
    row.hidden = !match;
    if (match) visible += 1;
  }
  count.textContent = visible === 0
    ? "Nenhum requerimento encontrado."
    : visible === 1
      ? "1 requerimento encontrado."
      : `${visible} requerimentos encontrados.`;
}

search.addEventListener("input", applyFilter);
applyFilter();

const form = document.querySelector("#formulario");
const success = document.querySelector("[data-iui-success]");
const requerente = document.querySelector("#requerente");
const tipo = document.querySelector("#tipo");
const requerenteErro = document.querySelector("#requerente-erro");
const tipoErro = document.querySelector("#tipo-erro");

function setFieldError(field, message, invalid) {
  message.hidden = !invalid;
  field.setAttribute("aria-invalid", invalid ? "true" : "false");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nomeInvalido = requerente.value.trim().length === 0;
  const tipoInvalido = tipo.value === "";
  setFieldError(requerente, requerenteErro, nomeInvalido);
  setFieldError(tipo, tipoErro, tipoInvalido);
  success.hidden = nomeInvalido || tipoInvalido;
  if (nomeInvalido) requerente.focus();
  else if (tipoInvalido) tipo.focus();
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    setFieldError(requerente, requerenteErro, false);
    setFieldError(tipo, tipoErro, false);
    success.hidden = true;
  }, 0);
});

document.querySelector("[data-iui-simulate]").addEventListener("click", () => {
  document.querySelector("[data-iui-simulated]").hidden = false;
});
