import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { escape, money, errorBox } from "../../shared/ui/helpers.js";
import { getCart, saveCart } from "../../features/cart/cart.store.js";
const user = await shell("cart", { roles: ["customer"] });
if (user) {
  const box = document.querySelector("#cartItems");
  let products = [];
  function render() {
    const items = getCart();
    let total = 0;
    box.innerHTML = items.length
      ? items
          .map((i) => {
            const p = products.find((p) => p.id === i.productId);
            if (!p)
              return `<div class="cart-item">สินค้าไม่พร้อมขาย <button data-remove="${i.productId}">ลบ</button></div>`;
            total += p.price_cents * i.quantity;
            return `<div class="cart-item"><img src="/assets/photos/${escape(p.art)}.jpg" alt=""><div><h3>${escape(p.name)}</h3><span class="small muted">${money(p.price_cents)} / ชิ้น · คงเหลือ ${p.stock}</span></div><div class="cart-controls"><input type="number" min="1" max="100" value="${i.quantity}" aria-label="จำนวน ${escape(p.name)}" data-qty="${p.id}"><button data-remove="${p.id}" aria-label="ลบ ${escape(p.name)}">✕</button></div></div>`;
          })
          .join("")
      : '<div class="empty">ตะกร้ายังว่าง เลือกของสำหรับทริปถัดไปได้เลย</div>';
    document.querySelector("#total").textContent = money(total);
    document.querySelector("#checkoutLink").hidden = !items.length;
    box.querySelectorAll("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          saveCart(getCart().filter((i) => i.productId !== +b.dataset.remove));
          render();
        }),
    );
    box.querySelectorAll("[data-qty]").forEach(
      (input) =>
        (input.onchange = () => {
          const n = +input.value;
          if (!Number.isInteger(n) || n < 1 || n > 100) {
            render();
            return;
          }
          saveCart(
            getCart().map((i) =>
              i.productId === +input.dataset.qty ? { ...i, quantity: n } : i,
            ),
          );
          render();
        }),
    );
  }
  try {
    ({ products } = await api("/products"));
    render();
  } catch (e) {
    errorBox(box, e);
  }
}
