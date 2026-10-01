import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { escape, money, errorBox } from "../../shared/ui/helpers.js";
import { getCart, clearCart } from "../../features/cart/cart.store.js";
import { placeOrder } from "../../features/checkout/checkout.api.js";
const user = await shell("cart", { roles: ["customer"] });
if (user) {
  let products = [];
  const summary = document.querySelector("#summary"),
    submit = document.querySelector("#submit");
  function render() {
    const items = getCart();
    let total = 0;
    summary.innerHTML = items.length
      ? items
          .map((i) => {
            const p = products.find((p) => p.id === i.productId);
            if (!p)
              return '<div class="error">สินค้าไม่พร้อมขาย กรุณากลับไปแก้ตะกร้า</div>';
            total += p.price_cents * i.quantity;
            return `<div class="row between summary-item"><span>${escape(p.name)} × ${i.quantity}</span><strong>${money(p.price_cents * i.quantity)}</strong></div>`;
          })
          .join("")
      : '<div class="empty">ตะกร้าว่าง <a href="/pages/home/">กลับไปเลือกสินค้า →</a></div>';
    document.querySelector("#total").textContent = money(total);
    submit.disabled = !items.length;
  }
  try {
    ({ products } = await api("/products"));
    render();
  } catch (e) {
    errorBox(summary, e);
    submit.disabled = true;
  }
  document.querySelector("#checkout").onsubmit = async (e) => {
    e.preventDefault();
    submit.disabled = true;
    const result = document.querySelector("#checkoutResult");
    try {
      const f = new FormData(e.target);
      const { order } = await placeOrder(
        f.get("name"),
        f.get("address"),
        getCart(),
      );
      clearCart();
      render();
      result.innerHTML = `<div class="success">สร้างออเดอร์ #${order.id} สำเร็จ · ${money(order.total_cents)}<br><a class="button spaced" href="/pages/my-orders/">ดูออเดอร์ของฉัน →</a></div>`;
    } catch (err) {
      errorBox(result, err);
      try {
        ({ products } = await api("/products"));
        render();
      } catch {}
      submit.disabled = !getCart().length;
    }
  };
}
