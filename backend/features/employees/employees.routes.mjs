import { route } from "../../core/router.mjs";
import { list, create, changeRole } from "./employees.service.mjs";
route("GET", "/api/admin/employees", ({ user }) => ({ employees: list(user) }));
route("POST", "/api/admin/employees", ({ user, body }) => create(user, body));
route("PATCH", "/api/admin/employees/:id", ({ user, body, params }) =>
  changeRole(user, params.id, body.role),
);
