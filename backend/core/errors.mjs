export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const assert = (condition, status, message) => {
  if (!condition) throw new HttpError(status, message);
};
export const integer = (v, min, max, label) => {
  const n = Number(v);
  assert(
    Number.isSafeInteger(n) && n >= min && n <= max,
    400,
    `${label} ไม่ถูกต้อง`,
  );
  return n;
};
export const text = (v, label, max = 200) => {
  assert(
    typeof v === "string" && v.trim().length > 0 && v.trim().length <= max,
    400,
    `${label} ต้องมี 1–${max} ตัวอักษร`,
  );
  return v.trim();
};
export const date = (v, label) => {
  assert(
    typeof v === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    400,
    `${label} ไม่ถูกต้อง`,
  );
  return v;
};
