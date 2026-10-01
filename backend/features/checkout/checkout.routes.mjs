import { route } from "../../core/router.mjs";
import { checkout } from "./checkout.service.mjs";
route("POST", "/api/orders", ({ user, body }) => ({
  order: checkout(user, body),
}));
