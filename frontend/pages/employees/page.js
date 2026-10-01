import { shell } from "../../shared/layout/shell.js";
import { api } from "../../shared/api/client.js";
import { escape, action, errorBox, toast } from "../../shared/ui/helpers.js";
const user = await shell("employees", { back: true, roles: ["admin"] });
if (user) {
  async function load() {
    const { employees } = await api("/admin/employees");
    document.querySelector("#employees").innerHTML = employees
      .map(
        (u) =>
          `<div class="row between spaced"><div><strong>${escape(u.name)}</strong><br><span class="badge">${u.role}</span></div>${u.id === user.id ? '<span class="small muted">บัญชีของคุณ</span>' : `<button data-id="${u.id}" data-role="${u.role === "admin" ? "staff" : "admin"}">เปลี่ยนเป็น ${u.role === "admin" ? "staff" : "admin"}</button>`}</div>`,
      )
      .join("");
    document.querySelectorAll("[data-id]").forEach(
      (b) =>
        (b.onclick = () =>
          action(b, async () => {
            await api("/admin/employees/" + b.dataset.id, {
              method: "PATCH",
              body: { role: b.dataset.role },
            });
            await load();
            toast("อัปเดตสิทธิ์แล้ว");
          })),
    );
  }
  document.querySelector("#employeeForm").onsubmit = async (e) => {
    e.preventDefault();
    const b = e.target.querySelector("button");
    b.disabled = true;
    try {
      await api("/admin/employees", {
        method: "POST",
        body: { name: new FormData(e.target).get("name") },
      });
      location.reload();
    } catch (err) {
      errorBox(document.querySelector("#formError"), err);
      b.disabled = false;
    }
  };
  try {
    await load();
  } catch (e) {
    errorBox(document.querySelector("#employees"), e);
  }
}
