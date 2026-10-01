import { assert, integer } from "../../core/errors.mjs";
import { transaction } from "../../core/database.mjs";
import { requireRole } from "../session/session.service.mjs";
import { validateProduct } from "./products.validation.mjs";
import {
  getProduct,
  insertProduct,
  updateProduct,
  recordMovement,
} from "./products.repository.mjs";
export function saveProduct(user, id, body) {
  requireRole(user, ["admin"]);
  const v = validateProduct(body);
  return transaction(() => {
    if (!id) {
      const p = insertProduct(v);
      if (v.stock) recordMovement(p.id, v.stock, "Initial stock", user.id);
      return p;
    }
    id = integer(id, 1, 1e9, "สินค้า");
    const old = getProduct(id);
    assert(old, 404, "ไม่พบสินค้า");
    const p = updateProduct(id, v);
    if (v.stock !== old.stock)
      recordMovement(
        id,
        v.stock - old.stock,
        "Admin stock adjustment",
        user.id,
      );
    return p;
  });
}
