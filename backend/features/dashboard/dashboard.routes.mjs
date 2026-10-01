import { route } from "../../core/router.mjs";
import { overview } from "./dashboard.service.mjs";
route("GET", "/api/admin/dashboard", ({ user }) => overview(user));
