import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";
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

  const type = types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`UI-NPA em http://${host}:${port}/examples/requerimentos/`);
});
