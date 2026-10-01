import { db } from "../../core/database.mjs";
export function findOrders(userId = null) {
  const orders = userId
    ? db
        .prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC")
        .all(userId)
    : db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
  const items = db.prepare("SELECT * FROM order_items WHERE order_id=?");
  return orders.map((o) => ({ ...o, items: items.all(o.id) }));
}
export const getOrder = (id) =>
  db.prepare("SELECT * FROM orders WHERE id=?").get(id);
export const getItems = (id) =>
  db.prepare("SELECT * FROM order_items WHERE order_id=?").all(id);
export function createOrder(user, v, total) {
  return Number(
    db
      .prepare(
        "INSERT INTO orders(user_id,customer_name,address,total_cents) VALUES(?,?,?,?)",
      )
      .run(user.id, v.name, v.address, total).lastInsertRowid,
  );
}
export const addItem = (id, p, qty) =>
  db
    .prepare(
      "INSERT INTO order_items(order_id,product_id,name,price_cents,quantity) VALUES(?,?,?,?,?)",
    )
    .run(id, p.id, p.name, p.price_cents, qty);
export const changeStock = (id, delta) =>
  db.prepare("UPDATE products SET stock=stock+? WHERE id=?").run(delta, id);
export const setStatus = (id, status) =>
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
