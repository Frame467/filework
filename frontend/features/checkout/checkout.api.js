import { api } from "../../shared/api/client.js";
export const placeOrder = (name, address, items) =>
  api("/orders", { method: "POST", body: { name, address, items } });
