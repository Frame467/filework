import { escape, money } from "../../shared/ui/helpers.js";
export const statusNames = {
  placed: "รับออเดอร์",
  packing: "กำลังจัดของ",
  shipped: "จัดส่งแล้ว",
  returned: "คืนสินค้าแล้ว",
  cancelled: "ยกเลิกแล้ว",
};
export function orderCard(o, admin = false) {
  const next = {
    placed: [
      ["packing", "เริ่มจัดของ"],
      ["cancelled", "ยกเลิก"],
    ],
    packing: [
      ["shipped", "ยืนยันจัดส่ง"],
      ["cancelled", "ยกเลิก"],
    ],
    shipped: [["returned", "รับคืนสินค้า"]],
    returned: [],
    cancelled: [],
  };
  return `<article class="panel order-card"><div class="row between"><h3>ORDER #${String(o.id).padStart(4, "0")}</h3><span class="badge order-status">${statusNames[o.status]}</span></div><p class="small">${escape(o.customer_name)} · ${escape(o.created_at)} UTC</p><div class="order-items">${o.items.map((i) => `<div class="row between"><span>${escape(i.name)} × ${i.quantity}</span><span>${money(i.price_cents * i.quantity)}</span></div>`).join("")}</div><p class="small spaced">จัดส่ง: ${escape(o.address)}</p><div class="row between"><strong>${money(o.total_cents)}</strong>${admin ? `<div class="row">${next[o.status].map(([status, label]) => `<button data-order="${o.id}" data-status="${status}" class="${status === "cancelled" ? "danger" : "primary"}">${label}</button>`).join("")}</div>` : ""}</div></article>`;
}
