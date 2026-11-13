import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

const colorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const dimensionPattern = /^(?:0|-?\d+(?:\.\d+)?(?:px|rem|em|%))$/;
const durationPattern = /^\d+ms$/;
const aliasPattern = /^\{([a-z0-9.-]+)\}$/;
const segmentPattern = /^[a-z0-9-]+$/;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Falha ao ler ${file}: ${error.message}`);
  }
}

function flatten(node, segments = [], file = "tokens") {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new Error(`Grupo inválido em ${file}: ${segments.join(".") || "(raiz)"}`);
  }

  const tokens = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (!segmentPattern.test(key)) {
      throw new Error(`Nome de token inválido "${key}" em ${file}. Use letras minúsculas, números e hífen.`);
    }
    const next = [...segments, key];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Valor inválido em ${next.join(".")}`);
    }
    if ("$value" in value) {
      if (typeof value.$type !== "string" || value.$type.length === 0) {
        throw new Error(`Tipo ausente em ${next.join(".")}`);
      }
      tokens.push({
        path: next,
        type: value.$type,
        value: value.$value,
      });
      continue;
    }
    const children = Object.keys(value).filter((child) => !child.startsWith("$"));
    if (children.length === 0) {
      throw new Error(`Grupo vazio: ${next.join(".")}`);
    }
    tokens.push(...flatten(value, next, file));
  }
  return tokens;
}

function collectRefs(value, refs = []) {
  if (typeof value === "string") {
    if (value.includes("{")) {
      const match = aliasPattern.exec(value);
      if (!match) throw new Error(`Alias parcial não suportado: ${value}`);
      refs.push(match[1]);
    }
    return refs;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, refs);
    return refs;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectRefs(item, refs);
  }
  return refs;
}

function resolveValue(value, dict, stack) {
  if (typeof value === "string" && value.includes("{")) {
    const match = aliasPattern.exec(value);
    const ref = match[1];
    if (stack.includes(ref)) {
      throw new Error(`Alias não resolvido: ciclo em ${ref}`);
    }
    const target = dict.get(ref);
    if (!target) {
      const error = new Error(`Alias não resolvido: ${ref}`);
      error.unresolved = true;
      throw error;
    }
    return resolveValue(target.value, dict, [...stack, ref]);
  }
  if (Array.isArray(value)) return value.map((item) => resolveValue(item, dict, stack));
  if (value && typeof value === "object") {
    const resolved = {};
    for (const [key, item] of Object.entries(value)) {
      resolved[key] = resolveValue(item, dict, stack);
    }
    return resolved;
  }
  return value;
}

function resolveAll(tokens, seed) {
  const dict = new Map(seed);
  const pending = tokens.map((token) => ({ ...token }));
  const resolved = [];

  while (pending.length > 0) {
    let progressed = false;
    for (let index = 0; index < pending.length; ) {
      const token = pending[index];
      const refs = collectRefs(token.value);
      if (refs.some((ref) => !dict.has(ref))) {
        index += 1;
        continue;
      }
      const value = resolveValue(token.value, dict, []);
      const done = { path: token.path, type: token.type, value };
      dict.set(token.path.join("."), done);
      resolved.push(done);
      pending.splice(index, 1);
      progressed = true;
    }
    if (!progressed) {
      const names = pending.map((token) => `${token.path.join(".")} -> ${JSON.stringify(token.value)}`);
      throw new Error(`Alias não resolvido: ${names.join("; ")}`);
    }
  }

  return { dict, resolved };
}

function assertColor(value, label) {
  if (typeof value !== "string" || !colorPattern.test(value)) {
    throw new Error(`Cor inválida em ${label}: ${JSON.stringify(value)}`);
  }
}

function assertDimension(value, label) {
  if (typeof value !== "string" || !dimensionPattern.test(value)) {
    throw new Error(`Dimensão inválida em ${label}: ${JSON.stringify(value)}`);
  }
}

function toCss(token) {
  const label = token.path.join(".");
  switch (token.type) {
    case "color":
      assertColor(token.value, label);
      return token.value.toLowerCase();
    case "dimension":
      assertDimension(token.value, label);
      return token.value;
    case "duration":
      if (typeof token.value !== "string" || !durationPattern.test(token.value)) {
        throw new Error(`Duração inválida em ${label}`);
      }
      return token.value;
    case "number":
      if (typeof token.value !== "number" || !Number.isFinite(token.value)) {
        throw new Error(`Número inválido em ${label}`);
      }
      return String(token.value);
    case "fontWeight":
      if (typeof token.value !== "number" || !Number.isFinite(token.value)) {
        throw new Error(`Peso tipográfico inválido em ${label}`);
      }
      return String(token.value);
    case "fontFamily":
      if (!Array.isArray(token.value) || token.value.some((font) => typeof font !== "string")) {
        throw new Error(`Família tipográfica inválida em ${label}`);
      }
      return token.value
        .map((font) => (/^(?:sans-serif|serif|monospace|system-ui|emoji|cursive|fantasy)$/.test(font) ? font : `"${font}"`))
        .join(", ");
    case "cubicBezier":
      if (!Array.isArray(token.value) || token.value.length !== 4 || token.value.some((item) => typeof item !== "number")) {
        throw new Error(`Curva inválida em ${label}`);
      }
      return `cubic-bezier(${token.value.join(", ")})`;
    case "shadow": {
      const shadow = token.value;
      if (!shadow || typeof shadow !== "object" || Array.isArray(shadow)) {
        throw new Error(`Sombra inválida em ${label}`);
      }
      assertColor(shadow.color, label);
      for (const key of ["offsetX", "offsetY", "blur", "spread"]) {
        assertDimension(shadow[key], `${label}.${key}`);
      }
      return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color.toLowerCase()}`;
    }
    default:
      throw new Error(`Tipo de token não suportado: ${token.type}`);
  }
}

function renderBlock(selector, tokens) {
  const lines = tokens
    .map((token) => `  --iui-${token.path.join("-")}: ${toCss(token)};`)
    .sort((left, right) => left.localeCompare(right));
  return `${selector} {\n${lines.join("\n")}\n}`;
}

function dictionaryOf(tokens) {
  const output = {};
  for (const token of tokens) {
    output[token.path.join(".")] = { type: token.type, value: token.value };
  }
  return output;
}

export function buildTokens(rootDir = defaultRoot) {
  const tokenDir = path.join(rootDir, "packages", "tokens");
  const primitiveTokens = flatten(readJson(path.join(tokenDir, "primitive.tokens.json")), [], "primitive.tokens.json");
  const lightTokens = flatten(readJson(path.join(tokenDir, "semantic.light.tokens.json")), [], "semantic.light.tokens.json");
  const darkTokens = flatten(readJson(path.join(tokenDir, "semantic.dark.tokens.json")), [], "semantic.dark.tokens.json");

  const primitives = resolveAll(primitiveTokens, new Map());
  for (const token of [...lightTokens, ...darkTokens]) {
    const key = token.path.join(".");
    if (primitives.dict.has(key)) {
      throw new Error(`Colisão com primitivo: ${key}`);
    }
  }

  const light = resolveAll(lightTokens, primitives.dict);
  const dark = resolveAll(darkTokens, primitives.dict);
  const lightKeys = light.resolved.map((token) => token.path.join(".")).sort();
  const darkKeys = dark.resolved.map((token) => token.path.join(".")).sort();
  if (lightKeys.join("\n") !== darkKeys.join("\n")) {
    throw new Error("Tema claro e escuro possuem caminhos diferentes.");
  }

  let version = "0.0.0";
  const packagePath = path.join(rootDir, "package.json");
  if (fs.existsSync(packagePath)) {
    version = readJson(packagePath).version || version;
  }

  const css = [
    "/* Não editar. Gerado por scripts/build-tokens.mjs a partir de packages/tokens. */",
    `/* UI-NPA ${version}. Paleta clara oficial: Azul Institucional Equilibrado (A), homologada em 2026-11-12. Tema escuro experimental. */`,
    "",
    renderBlock(":root", primitives.resolved),
    "",
    renderBlock(':root,\n[data-iui-theme="light"]', light.resolved),
    "",
    renderBlock('[data-iui-theme="dark"]', dark.resolved),
    "",
  ].join("\n");

  return {
    css,
    primitives: dictionaryOf(primitives.resolved),
    light: dictionaryOf(light.resolved),
    dark: dictionaryOf(dark.resolved),
  };
}

function isDirectRun() {
  const entry = process.argv[1];
  return Boolean(entry) && import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const result = buildTokens();
  const target = path.join(defaultRoot, "packages", "styles", "tokens.css");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, result.css);
  console.log(`Gerado ${path.relative(defaultRoot, target)}`);
}
