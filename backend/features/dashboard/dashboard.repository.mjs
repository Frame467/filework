import { db } from "../../core/database.mjs";
export const summary = () =>
  db
    .prepare(
      "SELECT COUNT(*) total_orders,COALESCE(SUM(CASE WHEN status NOT IN ('returned','cancelled') THEN total_cents ELSE 0 END),0) revenue_cents,SUM(CASE WHEN status IN ('placed','packing') THEN 1 ELSE 0 END) pending FROM orders",
    )
    .get();
export const lowStock = () =>
  db
    .prepare(
      "SELECT * FROM products WHERE active=1 AND stock<=5 ORDER BY stock",
    )
    .all();
export const recent = () =>
  db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 5").all();
