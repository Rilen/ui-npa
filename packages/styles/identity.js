const groups = ["municipality", "department", "sector"];
const httpProtocols = new Set(["http:", "https:"]);

function hasScheme(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function isAllowedResourceUrl(value) {
  const trimmed = value.trim();
  if (!hasScheme(trimmed)) return true;
  try {
    const url = new URL(trimmed);
    if (httpProtocols.has(url.protocol)) return true;
    return url.protocol === "data:" && /^data:image\//i.test(trimmed);
  } catch {
    return false;
  }
}

function isAllowedNavigationUrl(value) {
  const trimmed = value.trim();
  if (!hasScheme(trimmed)) return true;
  try {
    return httpProtocols.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}

export function assertInstitutionalIdentity(identity) {
  if (!identity || typeof identity !== "object" || Array.isArray(identity)) {
    throw new TypeError("A identidade institucional deve ser um objeto.");
  }

  for (const group of groups) {
    const value = identity[group];
    if (!value || typeof value !== "object") {
      throw new TypeError(`Informe ${group}.`);
    }
    for (const field of ["name", "logo", "logoAlt"]) {
      if (typeof value[field] !== "string" || value[field].trim() === "") {
        throw new TypeError(`Informe ${group}.${field}.`);
      }
    }
    if (!isAllowedResourceUrl(value.logo)) {
      throw new TypeError(`${group}.logo deve ser caminho relativo, HTTP(S) ou data:image.`);
    }
  }

  const application = identity.application;
  if (!application || typeof application !== "object") {
    throw new TypeError("Informe application.");
  }
  for (const field of ["name", "version", "developer"]) {
    if (typeof application[field] !== "string" || application[field].trim() === "") {
      throw new TypeError(`Informe application.${field}.`);
    }
  }

  const hasEntries = Array.isArray(application.changelog);
  const hasUrl = typeof application.changelogUrl === "string" && application.changelogUrl.trim() !== "";
  if (!hasEntries && !hasUrl) {
    throw new TypeError("Informe application.changelog ou application.changelogUrl.");
  }
  if (hasUrl && !isAllowedNavigationUrl(application.changelogUrl)) {
    throw new TypeError("application.changelogUrl deve ser caminho relativo ou HTTP(S).");
  }
  if (hasEntries) {
    for (const entry of application.changelog) {
      if (!entry || typeof entry.version !== "string" || typeof entry.date !== "string" || !Array.isArray(entry.notes)) {
        throw new TypeError("Cada item de changelog precisa de version, date e notes.");
      }
    }
  }

  if (identity.designSystem) {
    for (const field of ["name", "version"]) {
      if (typeof identity.designSystem[field] !== "string" || identity.designSystem[field].trim() === "") {
        throw new TypeError(`Informe designSystem.${field}.`);
      }
    }
  }

  return identity;
}

export function applyInstitutionalIdentity(root, identity) {
  if (!root || root.nodeType !== 1) {
    throw new TypeError("applyInstitutionalIdentity espera o elemento raiz.");
  }
  const value = assertInstitutionalIdentity(identity);

  for (const group of groups) {
    const slot = root.querySelector(`[data-iui-slot="${group}"]`);
    if (!slot) throw new Error(`Slot ausente: ${group}.`);
    const logo = slot.querySelector("[data-iui-logo]");
    const label = slot.querySelector("[data-iui-label]");
    if (!logo) throw new Error(`Logomarca ausente: ${group}.`);
    logo.src = value[group].logo;
    logo.alt = label ? "" : value[group].logoAlt;
    if (label) label.textContent = value[group].name;
  }

  for (const name of root.querySelectorAll("[data-iui-app-name]")) {
    name.textContent = value.application.name;
  }
  for (const version of root.querySelectorAll("[data-iui-app-version]")) {
    version.textContent = value.application.version;
  }
  for (const credit of root.querySelectorAll("[data-iui-developer]")) {
    credit.textContent = `Desenvolvido por ${value.application.developer}`;
  }

  const changelogLink = root.querySelector("[data-iui-changelog-link]");
  if (changelogLink) {
    changelogLink.href = value.application.changelogUrl || "#changelog";
  }
  renderChangelog(root.querySelector("[data-iui-changelog]"), value.application.changelog);
  renderAbout(root.querySelector("[data-iui-about]"), value);
  return value;
}

function renderChangelog(container, entries) {
  if (!container || !Array.isArray(entries)) return;
  container.replaceChildren();
  for (const entry of entries) {
    const article = document.createElement("article");
    article.className = "iui-card iui-stack iui-stack--sm";
    const title = document.createElement("h2");
    title.className = "iui-heading";
    title.textContent = entry.version;
    const date = document.createElement("p");
    date.className = "iui-text iui-text--sm iui-text--muted";
    date.textContent = entry.date;
    article.append(title, date);
    for (const note of entry.notes) {
      const paragraph = document.createElement("p");
      paragraph.className = "iui-text";
      paragraph.textContent = note;
      article.append(paragraph);
    }
    container.append(article);
  }
}

function renderAbout(container, identity) {
  if (!container) return;
  const technical = [["Desenvolvido por", identity.application.developer]];
  if (identity.designSystem) {
    technical.push(["Design system", `${identity.designSystem.name} ${identity.designSystem.version}`]);
  }
  container.replaceChildren(
    aboutGroup("Identidade institucional", [
      ["Prefeitura", identity.municipality.name],
      ["Secretaria", identity.department.name],
      ["Setor", identity.sector.name],
    ]),
    aboutGroup(
      "Aplicação",
      [
        ["Nome", identity.application.name],
        ["Versão da aplicação", identity.application.version],
      ],
      {
        href: identity.application.changelogUrl || "#changelog",
        label: "Ver novidades",
      },
    ),
    aboutGroup("Informações técnicas", technical),
  );
}

function aboutGroup(title, facts, changelog) {
  const section = document.createElement("section");
  section.className = "iui-card iui-stack";
  const heading = document.createElement("h2");
  heading.className = "iui-heading";
  heading.textContent = title;
  const list = document.createElement("dl");
  list.className = "iui-meta";
  for (const [label, text] of facts) {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = text;
    group.append(term, detail);
    list.append(group);
  }
  section.append(heading, list);
  if (changelog) {
    const link = document.createElement("a");
    link.className = "iui-button iui-button--secondary iui-button--sm";
    link.href = changelog.href;
    link.textContent = changelog.label;
    link.dataset.iuiAboutChangelog = "true";
    section.append(link);
  }
  return section;
}
