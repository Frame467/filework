import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { money, escape, errorBox, toast } from "../../shared/ui/helpers.js";
const user = await shell("products", { back: true, roles: ["staff", "admin"] });
if (user) {
  let products = [],
    editing = null;
  const dialog = document.querySelector("#editor"),
    form = document.querySelector("#productForm");
  document.querySelector("#newProduct").hidden = user.role !== "admin";
  async function load() {
    const data = await api("/admin/products");
    products = data.products;
    document.querySelector("#products").innerHTML =
      `<table><thead><tr><th>สินค้า</th><th>หมวด</th><th>ราคา</th><th>คงเหลือ</th><th>สถานะ</th>${user.role === "admin" ? "<th>จัดการ</th>" : ""}</tr></thead><tbody>${products.map((p) => `<tr><td><strong>${escape(p.name)}</strong><br><span class="small muted">SKU-${String(p.id).padStart(4, "0")}</span></td><td>${escape(p.category)}</td><td>${money(p.price_cents)}</td><td>${p.stock}</td><td>${p.active ? "พร้อมขาย" : "ซ่อน"}</td>${user.role === "admin" ? `<td><button data-edit="${p.id}">แก้ไข</button></td>` : ""}</tr>`).join("")}</tbody></table>`;
    document.querySelector("#movements").innerHTML = data.movements.length
      ? `<table><thead><tr><th>สินค้า</th><th>เปลี่ยนแปลง</th><th>เหตุผล</th><th>ผู้ทำรายการ</th></tr></thead><tbody>${data.movements.map((m) => `<tr><td>${escape(m.product_name)}</td><td>${m.delta > 0 ? "+" : ""}${m.delta}</td><td>${escape(m.reason)}</td><td>${escape(m.actor)}</td></tr>`).join("")}</tbody></table>`
      : "<p>ยังไม่มีการเคลื่อนไหว</p>";
    document
      .querySelectorAll("[data-edit]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            edit(products.find((p) => p.id === +b.dataset.edit))),
      );
  }
  function edit(p) {
    editing = p?.id || null;
    form.reset();
    document.querySelector("#editorTitle").textContent = p
      ? "แก้สินค้า"
      : "เพิ่มสินค้า";
    document.querySelector("#formError").innerHTML = "";
    if (p) {
      form.elements.name.value = p.name;
      form.elements.category.value = p.category;
      form.elements.price.value = p.price_cents / 100;
      form.elements.description.value = p.description;
      form.elements.stock.value = p.stock;
      form.elements.active.value = p.active;
    }
    dialog.showModal();
  }
  document.querySelector("#newProduct").onclick = () => edit();
  document.querySelector("#closeEditor").onclick = () => dialog.close();
  form.onsubmit = async (e) => {
    e.preventDefault();
    const button = form.querySelector("[type=submit]");
    button.disabled = true;
    try {
      const f = new FormData(form);
      await api("/admin/products" + (editing ? "/" + editing : ""), {
        method: editing ? "PATCH" : "POST",
        body: {
          name: f.get("name"),
          category: f.get("category"),
          description: f.get("description"),
          price_cents: Math.round(+f.get("price") * 100),
          stock: +f.get("stock"),
          active: +f.get("active"),
        },
      });
      dialog.close();
      await load();
      toast("บันทึกสินค้าแล้ว");
    } catch (e) {
      errorBox(document.querySelector("#formError"), e);
    } finally {
      button.disabled = false;
    }
  };
  try {
    await load();
  } catch (e) {
    errorBox(document.querySelector("#products"), e);
  }
}
