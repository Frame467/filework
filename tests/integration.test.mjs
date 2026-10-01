import { test, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const temp = mkdtempSync(join(tmpdir(), "resume-test-"));
const server = spawn(process.execPath, ["backend/server.mjs"], {
  cwd: fileURLToPath(new URL("../", import.meta.url)),
  env: { ...process.env, PORT: "4281", DB_PATH: join(temp, "test.sqlite") },
  stdio: ["ignore", "pipe", "pipe"],
});
let errors = "";
server.stderr.on("data", (d) => (errors += d));
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    server.kill();
    reject(new Error("Server startup timeout " + errors));
  }, 10000);
  server.stdout.on("data", (d) => {
    if (String(d).includes("READY")) {
      clearTimeout(timer);
      resolve();
    }
  });
  server.on("exit", (c) => {
    clearTimeout(timer);
    reject(new Error("Server exit " + c + " " + errors));
  });
});
const base = "http://localhost:4281";
function client() {
  let cookie = "";
  return async (path, method = "GET", body) => {
    const r = await fetch(base + "/api" + path, {
      method,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.headers.get("set-cookie"))
      cookie = r.headers.get("set-cookie").split(";")[0];
    return { status: r.status, data: await r.json() };
  };
}
after(async () => {
  if (server.exitCode === null) {
    const exited = new Promise((r) => server.once("exit", r));
    server.kill();
    await exited;
  }
  rmSync(temp, { recursive: true, force: true });
});

test("last-unit race, permissions, transition and exactly-once stock restoration", async () => {
  const a = client(),
    b = client(),
    admin = client();
  assert.equal((await a("/admin/orders")).status, 401);
  await a("/session", "POST", { userId: 1 });
  await b("/session", "POST", { userId: 1 });
  await admin("/session", "POST", { userId: 3 });
  assert.equal((await a("/admin/products", "POST", {})).status, 403);
  const item = {
    name: "Demo",
    address: "Demo address",
    items: [{ productId: 5, quantity: 1 }],
  };
  const race = await Promise.all([
    a("/orders", "POST", item),
    b("/orders", "POST", item),
  ]);
  assert.deepEqual(race.map((r) => r.status).sort(), [200, 409]);
  const id = race.find((r) => r.status === 200).data.order.id;
  assert.equal(
    (await admin("/admin/orders/" + id, "PATCH", { status: "shipped" })).status,
    409,
  );
  assert.equal(
    (await admin("/admin/orders/" + id, "PATCH", { status: "packing" })).status,
    200,
  );
  assert.equal(
    (await admin("/admin/orders/" + id, "PATCH", { status: "shipped" })).status,
    200,
  );
  assert.equal(
    (await admin("/admin/orders/" + id, "PATCH", { status: "returned" }))
      .status,
    200,
  );
  assert.equal(
    (await admin("/admin/orders/" + id, "PATCH", { status: "returned" }))
      .status,
    409,
  );
  assert.equal(
    (await a("/products")).data.products.find((p) => p.id === 5).stock,
    1,
  );
});
test("invalid/duplicate checkout and multi-line rollback", async () => {
  const c = client();
  await c("/session", "POST", { userId: 1 });
  const before = (await c("/products")).data.products.find(
    (p) => p.id === 1,
  ).stock;
  assert.equal(
    (
      await c("/orders", "POST", {
        name: "Demo",
        address: "Demo",
        items: [
          { productId: 1, quantity: 1 },
          { productId: 3, quantity: 100 },
        ],
      })
    ).status,
    409,
  );
  assert.equal(
    (await c("/products")).data.products.find((p) => p.id === 1).stock,
    before,
  );
  assert.equal(
    (
      await c("/orders", "POST", {
        name: "Demo",
        address: "Demo",
        items: [
          { productId: 1, quantity: 1 },
          { productId: 1, quantity: 1 },
        ],
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await c("/orders", "POST", {
        name: "Demo",
        address: "Demo",
        items: [{ productId: 1, quantity: -1 }],
      })
    ).status,
    400,
  );
});
test("staff cannot change products and server prices override supplied totals", async () => {
  const staff = client(),
    customer = client();
  await staff("/session", "POST", { userId: 2 });
  assert.equal((await staff("/admin/products/1", "PATCH", {})).status, 403);
  assert.equal((await staff("/admin/employees")).status, 403);
  await customer("/session", "POST", { userId: 1 });
  const r = await customer("/orders", "POST", {
    name: "Demo",
    address: "Demo",
    total_cents: 1,
    items: [{ productId: 2, quantity: 1, price_cents: 1 }],
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.order.total_cents, 89000);
});
