import { route } from "../../core/router.mjs";
import { requireRole } from "../session/session.service.mjs";
import { findOrders } from "./orders.repository.mjs";
import { transition } from "./orders.service.mjs";
route("GET", "/api/orders", ({ user }) => {
  requireRole(user, ["customer"]);
  return { orders: findOrders(user.id) };
});
route("GET", "/api/admin/orders", ({ user }) => {
  requireRole(user, ["staff", "admin"]);
  return { orders: findOrders() };
});
route("PATCH", "/api/admin/orders/:id", ({ user, body, params }) => ({
  order: transition(user, params.id, body.status),
}));
