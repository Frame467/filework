import { HttpError, assert } from "./errors.mjs";
export const routes = [];
export function route(method, pattern, handler) {
  const keys = [];
  const rx = new RegExp(
    "^" +
      pattern.replace(/:([A-Za-z]+)/g, (_, key) => {
        keys.push(key);
        return "([^/]+)";
      }) +
      "/?$",
  );
  routes.push({ method, rx, keys, handler });
}
export async function dispatch(req, res, user) {
  const pathname = new URL(req.url, "http://localhost").pathname;
  for (const r of routes) {
    const match = pathname.match(r.rx);
    if (r.method === req.method && match) {
      let body = {};
      if (["POST", "PATCH", "PUT"].includes(req.method)) {
        assert(
          (req.headers["content-type"] || "").includes("application/json"),
          415,
          "ต้องส่ง JSON",
        );
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          assert(raw.length <= 65536, 413, "ข้อมูลใหญ่เกินไป");
        }
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          throw new HttpError(400, "JSON ไม่ถูกต้อง");
        }
        assert(
          body && typeof body === "object" && !Array.isArray(body),
          400,
          "ข้อมูลต้องเป็น object",
        );
      }
      const params = Object.fromEntries(
        r.keys.map((k, i) => [k, decodeURIComponent(match[i + 1])]),
      );
      const result = await r.handler({ req, res, user, body, params });
      if (!res.writableEnded) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(result ?? {}));
      }
      return;
    }
  }
  throw new HttpError(404, "ไม่พบ API");
}
