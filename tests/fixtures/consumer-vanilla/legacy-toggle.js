import { mountSidebar } from "./.vendor/sidebar.js";

mountSidebar(document.querySelector("#legacy-sidebar"), {
  toggle: document.querySelector("[data-iui-sidebar-toggle]"),
  backdrop: document.querySelector(".iui-shell__backdrop"),
  content: document.querySelector(".iui-shell__content"),
  storage: {
    get() {
      return localStorage.getItem("ui-npa-legacy-toggle");
    },
    set(value) {
      localStorage.setItem("ui-npa-legacy-toggle", value);
    },
  },
});