import { assert } from "../../core/errors.mjs";
import { transaction } from "../../core/database.mjs";
import { requireRole } from "../session/session.service.mjs";
import {
  getProduct,
  recordMovement,
} from "../products/products.repository.mjs";
import * as repo from "../orders/orders.repository.mjs";
import { validateCheckout } from "./checkout.validation.mjs";
export function checkout(user, body) {
  requireRole(user, ["customer"]);
  const v = validateCheckout(body);
  return transaction(() => {
    const rows = v.items.map((i) => {
      const p = getProduct(i.productId);
      assert(p && p.active, 404, "สินค้าไม่พร้อมขาย");
      assert(
        p.stock >= i.quantity,
        409,
        `${p.name} เหลือ ${p.stock} ชิ้น กรุณาปรับตะกร้า`,
      );
      return { p, qty: i.quantity };
    });
    const total = rows.reduce((s, { p, qty }) => s + p.price_cents * qty, 0);
    const id = repo.createOrder(user, v, total);
    for (const { p, qty } of rows) {
      repo.addItem(id, p, qty);
      repo.changeStock(p.id, -qty);
      recordMovement(p.id, -qty, `Order #${id}`, user.id);
    }
    return { id, total_cents: total };
  });
}
