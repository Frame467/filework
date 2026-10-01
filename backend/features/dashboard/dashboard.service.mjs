import { requireRole } from "../session/session.service.mjs";
import * as repo from "./dashboard.repository.mjs";
export function overview(user) {
  requireRole(user, ["admin", "staff"]);
  return {
    summary: repo.summary(),
    lowStock: repo.lowStock(),
    recent: repo.recent(),
  };
}
