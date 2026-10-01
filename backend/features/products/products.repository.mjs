import { db } from "../../core/database.mjs";
export const allProducts = () =>
  db.prepare("SELECT * FROM products ORDER BY id").all();
export const getProduct = (id) =>
  db.prepare("SELECT * FROM products WHERE id=?").get(id);
export function insertProduct(v) {
  const r = db
    .prepare(
      "INSERT INTO products(name,category,description,price_cents,stock,art) VALUES(?,?,?,?,?,?)",
    )
    .run(v.name, v.category, v.description, v.price_cents, v.stock, "bag");
  return getProduct(Number(r.lastInsertRowid));
}
export function updateProduct(id, v) {
  db.prepare(
    "UPDATE products SET name=?,category=?,description=?,price_cents=?,stock=?,active=? WHERE id=?",
  ).run(
    v.name,
    v.category,
    v.description,
    v.price_cents,
    v.stock,
    v.active,
    id,
  );
  return getProduct(id);
}
export const movements = () =>
  db
    .prepare(
      "SELECT m.*,p.name product_name,u.name actor FROM inventory_movements m JOIN products p ON p.id=m.product_id JOIN users u ON u.id=m.user_id ORDER BY m.id DESC LIMIT 30",
    )
    .all();
export const recordMovement = (productId, delta, reason, userId) =>
  db
    .prepare(
      "INSERT INTO inventory_movements(product_id,delta,reason,user_id) VALUES(?,?,?,?)",
    )
    .run(productId, delta, reason, userId);
