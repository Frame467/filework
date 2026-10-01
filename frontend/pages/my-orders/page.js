import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { errorBox } from "../../shared/ui/helpers.js";
import { orderCard } from "../../features/orders/order-card.js";
const user = await shell("my-orders", { roles: ["customer"] });
if (user) {
  async function load() {
    try {
      const { orders } = await api("/orders");
      document.querySelector("#orders").innerHTML = orders.length
        ? orders.map((o) => orderCard(o)).join("")
        : '<div class="empty">ยังไม่มีออเดอร์ <a class="button" href="/pages/home/">เลือกสินค้า →</a></div>';
    } catch (e) {
      errorBox(document.querySelector("#orders"), e);
    }
  }
  await load();
  setInterval(load, 6000);
}
