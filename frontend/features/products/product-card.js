import { escape, money } from "../../shared/ui/helpers.js";
export function productCard(p) {
  return `<article class="product"><div class="product-image"><img src="/assets/photos/${escape(p.art)}.jpg" alt="${escape(p.name)}">${p.stock <= 1 ? `<span class="badge">${p.stock ? "ชิ้นสุดท้าย" : "สินค้าหมด"}</span>` : ""}</div><div class="product-info"><span class="eyebrow">${escape(p.category)}</span><h3>${escape(p.name)}</h3><p>${escape(p.description)}</p><div class="row between"><span class="price">${money(p.price_cents)}</span><button data-add="${p.id}" ${!p.stock ? "disabled" : ""}>${p.stock ? "+ ใส่ตะกร้า" : "หมด"}</button></div><span class="small muted">พร้อมส่ง ${p.stock} ชิ้น</span></div></article>`;
}
