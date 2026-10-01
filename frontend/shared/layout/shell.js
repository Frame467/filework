import { api } from "../api/client.js";
import { escape, toast } from "../ui/helpers.js";
import { getCart } from "../../features/cart/cart.store.js";
export async function shell(active, { back = false, roles = null } = {}) {
  let s = await api("/session");
  if (!s.user) {
    await api("/session", { method: "POST", body: { userId: 1 } });
    s = await api("/session");
  }
  if (back && s.user.role === "customer") {
    const operator =
      s.accounts.find((u) => u.role === "admin") ||
      s.accounts.find((u) => u.role === "staff");
    if (operator) {
      await api("/session", { method: "POST", body: { userId: operator.id } });
      s = await api("/session");
    }
  }
  const visibleAccounts = back
    ? s.accounts.filter((u) => u.role !== "customer")
    : s.accounts;
  const nav = back
    ? [
        ["dashboard", "ภาพรวม", "dashboard"],
        ["products", "สินค้า", "products"],
        ["orders", "ออเดอร์", "orders"],
        ...(s.user.role === "admin"
          ? [["employees", "พนักงาน", "employees"]]
          : []),
      ]
    : [
        ["home", "สินค้าทั้งหมด", "home"],
        ["cart", "ตะกร้า", "cart"],
        ["my-orders", "ออเดอร์ของฉัน", "my-orders"],
      ];
  document.querySelector("#shell").innerHTML =
    `<header class="site-header"><a class="logo" href="/pages/home/">Fieldwork<span class="logo-context">${back ? "OPERATIONS" : ""}</span></a><nav class="nav" aria-label="เมนูหลัก">${nav.map(([key, name, dir]) => `<a class="${active === key ? "active" : ""}" href="/pages/${dir}/">${name}${key === "cart" ? '<span id="cartCount"></span>' : ""}</a>`).join("")}<a href="/pages/${back ? "home" : "dashboard"}/">${back ? "หน้าร้าน ↗" : "หลังบ้าน ↗"}</a></nav><select class="account" id="account" aria-label="สลับบัญชีเดโม">${visibleAccounts.map((u) => `<option value="${u.id}" ${u.id === s.user.id ? "selected" : ""}>${escape(u.name)} · ${u.role}</option>`).join("")}</select></header>`;
  document.querySelector("#account").onchange = async (e) => {
    try {
      await api("/session", {
        method: "POST",
        body: { userId: Number(e.target.value) },
      });
      location.reload();
    } catch (err) {
      toast(err.message);
    }
  };
  function count() {
    const el = document.querySelector("#cartCount");
    if (el)
      el.textContent =
        " (" + getCart().reduce((a, i) => a + i.quantity, 0) + ")";
  }
  count();
  window.addEventListener("cartchange", count);
  document.querySelector("#footer").innerHTML =
    "<span>Fieldwork · ร้านค้าและจัดการออเดอร์</span><span>เดโมบนเครื่อง · ชำระเงินจำลอง · <a href='http://localhost:4173/workinresume/'>รวมโปรเจกต์</a> · <a href='/assets/photos/credits.html'>Photo credits</a></span>";
  if (roles && !roles.includes(s.user.role)) {
    document.querySelector("main").innerHTML =
      '<div class="panel"><h1 class="back-title">เลือกบัญชีที่มีสิทธิ์ก่อนครับ</h1><p>ใช้เมนูสลับบัญชีเดโมด้านบน บัญชีลูกค้าใช้หน้าร้าน พนักงานใช้จัดการออเดอร์ และเจ้าของร้านแก้สินค้าและพนักงานได้</p><a class="button" href="/pages/home/">กลับหน้าร้าน</a></div>';
    return null;
  }
  return s.user;
}
