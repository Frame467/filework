import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const filename =
  process.env.DB_PATH ||
  fileURLToPath(new URL("../../database/data/app.sqlite", import.meta.url));
mkdirSync(dirname(filename), { recursive: true });
export const db = new DatabaseSync(filename);
db.exec(
  "PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;",
);
const schemas = fileURLToPath(
  new URL("../../database/schema/", import.meta.url),
);
for (const name of readdirSync(schemas)
  .filter((n) => n.endsWith(".sql"))
  .sort())
  db.exec(readFileSync(join(schemas, name), "utf8"));
export function transaction(fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
