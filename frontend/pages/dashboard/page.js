import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { money, escape, errorBox } from "../../shared/ui/helpers.js";
import { statusNames } from "../../features/orders/order-card.js";
const user = await shell("dashboard", {
  back: true,
  roles: ["staff", "admin"],
});
if (user) {
  try {
    const { summary: s, lowStock, recent } = await api("/admin/dashboard");
    document.querySelector("#metrics").innerHTML = [
      ["ยอดขายสุทธิของเดโม", money(s.revenue_cents)],
      ["ออเดอร์ทั้งหมด", s.total_orders],
      ["รอจัดการ", s.pending || 0],
    ]
      .map(
        ([label, value]) =>
          `<div class="panel metric"><span class="eyebrow">${label}</span><strong>${value}</strong></div>`,
      )
      .join("");
    document.querySelector("#recent").innerHTML = recent.length
      ? `<div class="table-wrap"><table><thead><tr><th>ORDER</th><th>สถานะ</th><th>ยอดรวม</th></tr></thead><tbody>${recent.map((o) => `<tr><td>#${o.id} · ${escape(o.customer_name)}</td><td>${statusNames[o.status]}</td><td>${money(o.total_cents)}</td></tr>`).join("")}</tbody></table></div>`
      : "<p>ยังไม่มีออเดอร์ ลองสั่งสินค้าจากหน้าร้าน</p>";
    document.querySelector("#lowStock").innerHTML =
      lowStock
        .map(
          (p) =>
            `<div class="row between spaced"><span>${escape(p.name)}</span><span class="badge">เหลือ ${p.stock}</span></div>`,
        )
        .join("") || "<p>สต๊อกเพียงพอทุกชิ้น</p>";
  } catch (e) {
    errorBox(document.querySelector("#metrics"), e);
  }
}
