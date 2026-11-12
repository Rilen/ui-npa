/**
 * Contrato da sidebar canônica.
 * A aplicação fornece o elemento, os controles e, se quiser, a persistência.
 * Não há autenticação, autorização nem rotas de um sistema consumidor.
 */
export function mountSidebar(sidebar, options = {}) {
  if (!sidebar || sidebar.nodeType !== 1) {
    throw new TypeError("mountSidebar espera o elemento da sidebar.");
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("As opções da sidebar devem ser um objeto.");
  }

  const shell = sidebar.closest(".iui-shell");
  const toggle = options.toggle ?? null;
  const backdrop = options.backdrop ?? null;
  const content = options.content ?? null;
  const closeButton = sidebar.querySelector("[data-iui-sidebar-close]");
  const storage = options.storage ?? null;
  const media = window.matchMedia(options.mobileQuery || "(max-width: 47.99rem)");
  const label = toggle?.querySelector("[data-iui-toggle-label]") ?? null;
  let collapsed = readCollapsed(storage);

  function render() {
    const mobile = media.matches;
    if (!mobile && shell) shell.dataset.open = "false";
    const open = mobile && shell?.dataset.open === "true";
    sidebar.dataset.collapsed = collapsed ? "true" : "false";
    if (shell) shell.dataset.mode = mobile ? "mobile" : "desktop";
    const concealed = mobile && !open;
    sidebar.inert = concealed;
    if (concealed) sidebar.setAttribute("aria-hidden", "true");
    else sidebar.removeAttribute("aria-hidden");
    if (content) content.inert = open;
    if (backdrop) backdrop.hidden = !open;
    if (!toggle) return;
    const expanded = mobile ? open : !collapsed;
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    const text = mobile
      ? open ? "Fechar menu" : "Abrir menu"
      : collapsed ? "Expandir menu" : "Recolher menu";
    if (label) label.textContent = text;
  }

  function setCollapsed(next) {
    collapsed = Boolean(next);
    writeCollapsed(storage, collapsed);
    render();
  }

  function setOpen(next) {
    if (!shell) return;
    shell.dataset.open = next ? "true" : "false";
    render();
    if (next) {
      const items = focusable(sidebar);
      items[0]?.focus();
    } else {
      toggle?.focus();
    }
  }

  function onToggle() {
    if (media.matches) setOpen(shell?.dataset.open !== "true");
    else setCollapsed(!collapsed);
  }

  function onClose() {
    setOpen(false);
  }

  function onBackdrop(event) {
    if (event.target === backdrop) setOpen(false);
  }

  function onKeydown(event) {
    const mobileOpen = media.matches && shell?.dataset.open === "true";
    if (event.key === "Escape" && mobileOpen) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Tab" && mobileOpen) {
      trapTab(event, sidebar);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (!target || target.nodeType !== 1) return;
    const current = target.closest(".iui-sidebar__link");
    if (!current || !sidebar.contains(current)) return;
    const items = focusable(sidebar).filter((item) => item.classList.contains("iui-sidebar__link"));
    const index = items.indexOf(current);
    if (index === -1 || items.length === 0) return;
    event.preventDefault();
    if (event.key === "Home") items[0].focus();
    else if (event.key === "End") items[items.length - 1].focus();
    else if (event.key === "ArrowDown") items[(index + 1) % items.length].focus();
    else items[(index - 1 + items.length) % items.length].focus();
  }

  toggle?.addEventListener("click", onToggle);
  closeButton?.addEventListener("click", onClose);
  backdrop?.addEventListener("click", onBackdrop);
  document.addEventListener("keydown", onKeydown);
  media.addEventListener("change", render);
  render();

  return {
    setCollapsed,
    isCollapsed: () => collapsed,
    destroy() {
      toggle?.removeEventListener("click", onToggle);
      closeButton?.removeEventListener("click", onClose);
      backdrop?.removeEventListener("click", onBackdrop);
      document.removeEventListener("keydown", onKeydown);
      media.removeEventListener("change", render);
      sidebar.inert = false;
      if (content) content.inert = false;
    },
  };
}

function readCollapsed(storage) {
  if (!storage || typeof storage.get !== "function") return false;
  try {
    return storage.get() === "true";
  } catch {
    return false;
  }
}

function writeCollapsed(storage, collapsed) {
  if (!storage || typeof storage.set !== "function") return;
  try {
    storage.set(collapsed ? "true" : "false");
  } catch {
    /* A preferência é opcional. A sidebar continua utilizável. */
  }
}

function focusable(root) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  return [...root.querySelectorAll(selector)].filter((element) => {
    if (element.closest("[hidden]")) return false;
    return element.getClientRects().length > 0;
  });
}

function trapTab(event, sidebar) {
  const items = focusable(sidebar);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (!sidebar.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return;
  }
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
