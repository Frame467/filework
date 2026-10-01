import { db } from "../../core/database.mjs";
export const listEmployees = () =>
  db.prepare("SELECT id,name,role FROM users WHERE role!='customer'").all();
export const findEmployee = (id) =>
  db.prepare("SELECT id FROM users WHERE id=? AND role!='customer'").get(id);
export const insertEmployee = (name) =>
  Number(
    db.prepare("INSERT INTO users(name,role) VALUES(?,'staff')").run(name)
      .lastInsertRowid,
  );
export const updateRole = (id, role) =>
  db.prepare("UPDATE users SET role=? WHERE id=?").run(role, id);
