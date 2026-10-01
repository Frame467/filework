import { route } from "../../core/router.mjs";
import { listUsers } from "./session.repository.mjs";
import { switchUser } from "./session.service.mjs";
route("GET", "/api/session", ({ user }) => ({
  user,
  accounts: listUsers(),
  demo: true,
}));
route("POST", "/api/session", ({ res, body }) => ({
  user: switchUser(res, body.userId),
}));
