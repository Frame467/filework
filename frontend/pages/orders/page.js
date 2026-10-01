import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { errorBox, action, toast } from "../../shared/ui/helpers.js";
import { orderCard } from "../../features/orders/order-card.js";
const user = await shell("orders", { back: true, roles: ["admin", "staff"] });
if (user) {
  let orders = [];
  function render() {
    const f = document.querySelector("#filter").value;
    const items = orders.filter((o) => f === "all" || o.status === f);
    document.querySelector("#orders").innerHTML = items.length
      ? items.map((o) => orderCard(o, true)).join("")
      : '<div class="empty">ไม่มีออเดอร์ในสถานะนี้</div>';
    document.querySelectorAll("[data-order]").forEach(
      (b) =>
        (b.onclick = () =>
          action(b, async () => {
            await api("/admin/orders/" + b.dataset.order, {
              method: "PATCH",
              body: { status: b.dataset.status },
            });
            await load();
            toast("อัปเดตสถานะแล้ว");
          })),
    );
  }
  async function load() {
    ({ orders } = await api("/admin/orders"));
    render();
  }
  document.querySelector("#filter").onchange = render;
  try {
    await load();
  } catch (e) {
    errorBox(document.querySelector("#orders"), e);
  }
  setInterval(() => {
    if (!document.hidden) load().catch(() => {});
  }, 6000);
}
