import { applyInstitutionalIdentity } from "./.vendor/identity.js";
import { mountSidebar } from "./.vendor/sidebar.js";

const root = document.querySelector(".iui-root");
const sidebar = document.querySelector("#consumer-sidebar");
const storageKey = "ui-npa-consumer-sidebar";

applyInstitutionalIdentity(root, {
  municipality: {
    name: "Prefeitura de Exemplo",
    logo: "./assets/municipality.svg",
    logoAlt: "Marca fictícia da Prefeitura de Exemplo",
  },
  department: {
    name: "Secretaria de Serviços",
    logo: "./assets/department.svg",
    logoAlt: "Marca fictícia da Secretaria de Serviços",
  },
  sector: {
    name: "Setor de Protocolo",
    logo: "./assets/sector.svg",
    logoAlt: "Marca fictícia do Setor de Protocolo",
  },
  application: {
    name: "Sistema Consumidor",
    version: "2.1.0",
    developer: "NPA",
    changelog: [
      {
        version: "2.1.0",
        date: "2026-11-13",
        notes: ["Integração local validada com o pacote público do UI-NPA."],
      },
    ],
  },
  designSystem: {
    name: "UI-NPA",
    version: "0.3.4",
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
