import { randomBytes } from "node:crypto";
import { assert, integer } from "../../core/errors.mjs";
import { findUser } from "./session.repository.mjs";
const sessions = new Map(),
  cookie = "commerce_demo_session";
export function getUser(req) {
  const cookies = Object.fromEntries(
    (req.headers.cookie || "").split(";").map((v) => v.trim().split("=")),
  );
  const entry = sessions.get(cookies[cookie]);
  if (!entry || entry.expires < Date.now()) return null;
  return findUser(entry.id);
}
export function switchUser(res, id) {
  const user = findUser(integer(id, 1, 100, "บัญชี"));
  assert(user, 404, "ไม่พบบัญชี");
  for (const [key, v] of sessions)
    if (v.expires < Date.now()) sessions.delete(key);
  const token = randomBytes(24).toString("hex");
  sessions.set(token, { id: user.id, expires: Date.now() + 86400000 });
  res.setHeader(
    "Set-Cookie",
    `${cookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`,
  );
  return user;
}
export function requireUser(user) {
  assert(user, 401, "กรุณาเลือกบัญชีเดโม");
  return user;
}
export function requireRole(user, roles) {
  requireUser(user);
  assert(roles.includes(user.role), 403, "บัญชีนี้ไม่มีสิทธิ์ทำรายการ");
  return user;
}
