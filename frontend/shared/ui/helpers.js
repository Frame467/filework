export const escape = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const money = (c) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    c / 100,
  );
export function toast(message) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 4500);
}
export function errorBox(el, error) {
  el.innerHTML = `<div class="error" role="alert">${escape(error.message || error)}</div>`;
}
export async function action(button, fn) {
  button.disabled = true;
  try {
    await fn();
  } catch (e) {
    toast(e.message);
  } finally {
    button.disabled = false;
  }
}
export function dates(start, end) {
  const result = [];
  for (
    let d = new Date(start + "T00:00:00Z");
    d <= new Date(end + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 1)
  )
    result.push(d.toISOString().slice(0, 10));
  return result;
}
export const dateLabel = (d) =>
  new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d + "T00:00:00Z"));
