import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4174);
const host = "127.0.0.1";
const prefix = process.env.PREFIX || "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
};

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(body);
}

// Reescreve caminhos de recursos em HTML quando PREFIX está definido
function rewriteHtmlPaths(body, pref) {
  if (!pref) return body;
  // Adiciona <base> tag no head para que URLs relativas sejam resolvidas corretamente
  // O base href deve terminar com / e não conflitar com camais já existentes
  const baseTag = `<base href="${pref}" />`;
  return body.replace("<head>", `<head>${baseTag}`);
}

const server = http.createServer((request, response) => {
  let url;
  try {
    url = new URL(request.url || "/", `http://${host}:${port}`);
  } catch {
    send(response, 400, "URL inválida.");
    return;
  }

  if (url.pathname === "/favicon.ico") {
    send(response, 204, "");
    return;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(url.pathname);
  } catch {
    send(response, 400, "URL inválida.");
    return;
  }

  const requested = path.resolve(root, `.${decoded}`);
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (requested !== root && !requested.startsWith(rootWithSep)) {
    send(response, 403, "Caminho recusado.");
    return;
  }

  let filePath = requested;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    send(response, 404, "Não encontrado.");
    return;
  }

  const type = path.extname(filePath).toLowerCase();
  let contentType = types[type] || "application/octet-stream";
  let body;

  if (type === ".html") {
    body = fs.readFileSync(filePath, "utf8");
    // Aplica rewrite de caminhos se houver prefix
    body = rewriteHtmlPaths(body, prefix);
    contentType = "text/html; charset=utf-8";
  } else {
    body = fs.readFileSync(filePath);
  }

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(typeof body === "string" ? Buffer.from(body) : body).pipe(response);
});

server.listen(port, host, () => {
  const displayPort = port !== 4173 ? `${port}` : `4173`;
  console.log(`UI-NPA em http://${host}:${displayPort}/examples/requerimentos/ (prefix: "${prefix}")`);
});
