export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("ไม่สามารถอ่านข้อมูลจาก server");
  }
  if (!res.ok) {
    const e = new Error(data.error || "ทำรายการไม่สำเร็จ");
    e.status = res.status;
    throw e;
  }
  return data;
}
