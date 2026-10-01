import { assert, text, integer } from "../../core/errors.mjs";
export function validateCheckout(b) {
  assert(
    Array.isArray(b.items) && b.items.length > 0 && b.items.length <= 40,
    400,
    "ตะกร้าต้องมี 1–40 รายการ",
  );
  const seen = new Set();
  const items = b.items.map((i) => {
    const id = integer(i.productId, 1, 1e9, "สินค้า");
    assert(!seen.has(id), 400, "สินค้าในตะกร้าซ้ำ");
    seen.add(id);
    return { productId: id, quantity: integer(i.quantity, 1, 100, "จำนวน") };
  });
  return {
    name: text(b.name, "ชื่อผู้รับ", 100),
    address: text(b.address, "ที่อยู่", 500),
    items,
  };
}
