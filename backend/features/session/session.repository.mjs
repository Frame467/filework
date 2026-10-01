import { db } from "../../core/database.mjs";
export const findUser = (id) =>
  db.prepare("SELECT id,name,role FROM users WHERE id=?").get(id);
export const listUsers = () =>
  db.prepare("SELECT id,name,role FROM users ORDER BY id").all();
