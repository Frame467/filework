import { route } from "../../core/router.mjs";
import { allProducts, movements } from "./products.repository.mjs";
import { saveProduct } from "./products.service.mjs";
import { requireRole } from "../session/session.service.mjs";
route("GET", "/api/products", () => ({
  products: allProducts().filter((p) => p.active),
}));
route("GET", "/api/admin/products", ({ user }) => {
  requireRole(user, ["admin", "staff"]);
  return { products: allProducts(), movements: movements() };
});
route("POST", "/api/admin/products", ({ user, body }) => ({
  product: saveProduct(user, null, body),
}));
route("PATCH", "/api/admin/products/:id", ({ user, body, params }) => ({
  product: saveProduct(user, params.id, body),
}));
