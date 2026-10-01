import { requireRole } from "../session/session.service.mjs";
import { assert, integer, text } from "../../core/errors.mjs";
import * as repo from "./employees.repository.mjs";
export function list(user) {
  requireRole(user, ["admin"]);
  return repo.listEmployees();
}
export function create(user, body) {
  requireRole(user, ["admin"]);
  return { id: repo.insertEmployee(text(body.name, "ชื่อพนักงาน", 100)) };
}
export function changeRole(user, id, role) {
  requireRole(user, ["admin"]);
  id = integer(id, 1, 1e9, "พนักงาน");
  assert(id !== user.id, 409, "เปลี่ยนบทบาทตัวเองไม่ได้");
  assert(["admin", "staff"].includes(role), 400, "บทบาทไม่ถูกต้อง");
  assert(repo.findEmployee(id), 404, "ไม่พบพนักงาน");
  repo.updateRole(id, role);
  return { ok: true };
}
