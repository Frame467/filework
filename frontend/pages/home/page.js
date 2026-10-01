import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { toast, errorBox } from "../../shared/ui/helpers.js";
import { productCard } from "../../features/products/product-card.js";
import { addToCart } from "../../features/cart/cart.store.js";
await shell("home");
let products = [],
  category = "All";
const target = document.querySelector("#products");
function render() {
  const query = document.querySelector("#search").value.toLowerCase();
  const items = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query),
  );
  target.innerHTML = items.length
    ? items.map(productCard).join("")
    : '<div class="empty">ไม่พบสินค้าที่ค้นหา</div>';
  target.querySelectorAll("[data-add]").forEach(
    (b) =>
      (b.onclick = () => {
        try {
          const p = products.find((p) => p.id === Number(b.dataset.add));
          addToCart(p.id, p.stock);
          toast("เพิ่ม " + p.name + " ลงตะกร้าแล้ว");
        } catch (e) {
          toast(e.message);
        }
      }),
  );
}
document.querySelector("#search").oninput = render;
document.querySelectorAll("[data-category]").forEach(
  (b) =>
    (b.onclick = () => {
      category = b.dataset.category;
      document
        .querySelectorAll("[data-category]")
        .forEach((x) => x.classList.toggle("primary", x === b));
      render();
    }),
);
try {
  ({ products } = await api("/products"));
  render();
} catch (e) {
  errorBox(target, e);
}
