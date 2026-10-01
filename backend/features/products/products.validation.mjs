import { text, integer, assert } from "../../core/errors.mjs";
export function validateProduct(b) {
  assert(
    ["Bags", "Tech", "Essentials"].includes(b.category),
    400,
    "หมวดสินค้าไม่ถูกต้อง",
  );
  return {
    name: text(b.name, "ชื่อสินค้า", 100),
    category: b.category,
    description: text(b.description, "รายละเอียด", 1000),
    price_cents: integer(b.price_cents, 1, 100000000, "ราคา"),
    stock: integer(b.stock, 0, 100000, "สต๊อก"),
    active: b.active === false || b.active === 0 ? 0 : 1,
  };
}
