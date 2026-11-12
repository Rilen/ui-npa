import { mountSidebar } from "../../packages/styles/sidebar.js";

const sidebar = document.querySelector("#sidebar");
const storageKey = "ui-npa-demo-sidebar";

if (!sidebar) {
  throw new Error("Sidebar da demonstração não encontrada.");
}

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

function syncCurrent() {
  const hash = window.location.hash;
  const known = links.some((link) => link.getAttribute("href") === hash);
  const current = known ? hash : "#painel";
  for (const link of links) {
    if (link.getAttribute("href") === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

window.addEventListener("hashchange", syncCurrent);
syncCurrent();

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
