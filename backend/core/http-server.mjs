import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dispatch } from "./router.mjs";
import { getUser } from "../features/session/session.service.mjs";
const root = resolve(
  fileURLToPath(new URL("../../frontend/", import.meta.url)),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
};
export function startServer(defaultPort) {
  const server = http.createServer(async (req, res) => {
    try {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "same-origin");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      );
      if (req.url.startsWith("/api/")) {
        res.setHeader("Cache-Control", "no-store");
        if (!["GET", "HEAD"].includes(req.method)) {
          const origin = req.headers.origin;
          if (origin && origin !== `http://${req.headers.host}`) {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Origin ไม่ได้รับอนุญาต" }));
          }
        }
        await dispatch(req, res, getUser(req));
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        return res.end("Method not allowed");
      }
      let pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (pathname === "/") {
        res.writeHead(302, { Location: "/pages/home/" });
        return res.end();
      }
      let file = resolve(root, "." + pathname);
      if (!file.startsWith(root + sep)) {
        res.writeHead(403);
        return res.end("Forbidden");
      }
      try {
        if ((await stat(file)).isDirectory())
          file = resolve(file, "index.html");
        const bytes = await readFile(file);
        res.setHeader(
          "Content-Type",
          types[extname(file)] || "application/octet-stream",
        );
        res.setHeader("Cache-Control", "no-cache");
        res.end(req.method === "HEAD" ? undefined : bytes);
      } catch {
        res.writeHead(404);
        res.end("Page not found");
      }
    } catch (e) {
      if (!e.status) console.error(e);
      res.writeHead(e.status || 500, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(
        JSON.stringify({
          error: e.status ? e.message : "เกิดข้อผิดพลาดในระบบ",
        }),
      );
    }
  });
  server.listen(Number(process.env.PORT || defaultPort), "127.0.0.1", () =>
    console.log(`READY http://localhost:${process.env.PORT || defaultPort}`),
  );
  return server;
}
