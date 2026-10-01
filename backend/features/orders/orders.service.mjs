import { assert, integer } from "../../core/errors.mjs";
import { transaction } from "../../core/database.mjs";
import { requireRole } from "../session/session.service.mjs";
import { recordMovement } from "../products/products.repository.mjs";
import * as repo from "./orders.repository.mjs";
export function transition(user, id, status) {
  requireRole(user, ["admin", "staff"]);
  id = integer(id, 1, 1e9, "ออเดอร์");
  const transitions = {
    placed: ["packing", "cancelled"],
    packing: ["shipped", "cancelled"],
    shipped: ["returned"],
    returned: [],
    cancelled: [],
  };
  return transaction(() => {
    const o = repo.getOrder(id);
    assert(o, 404, "ไม่พบออเดอร์");
    assert(
      transitions[o.status].includes(status),
      409,
      "เปลี่ยนสถานะตามลำดับเท่านั้น",
    );
    if (["returned", "cancelled"].includes(status)) {
      for (const i of repo.getItems(id)) {
        repo.changeStock(i.product_id, i.quantity);
        recordMovement(
          i.product_id,
          i.quantity,
          `${status} order #${id}`,
          user.id,
        );
      }
    }
    repo.setStatus(id, status);
    return repo.getOrder(id);
  });
}
