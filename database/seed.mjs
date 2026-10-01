import { db, transaction } from "../backend/core/database.mjs";
export function seed() {
  if (db.prepare("SELECT COUNT(*) n FROM users").get().n) return;
  transaction(() => {
    const u = db.prepare("INSERT INTO users(id,name,role) VALUES(?,?,?)");
    u.run(1, "คุณลูกค้า", "customer");
    u.run(2, "มิน · ฝ่ายจัดส่ง", "staff");
    u.run(3, "อเล็กซ์ · เจ้าของร้าน", "admin");
    const p = db.prepare(
      "INSERT INTO products(id,name,category,description,price_cents,stock,art) VALUES(?,?,?,?,?,?,?)",
    );
    [
      [
        1,
        "Trailpack 24L",
        "Bags",
        "กระเป๋าเดินทางประจำวัน น้ำหนักเบา ช่องจัดของพร้อมสำหรับการออกไปสำรวจ",
        249000,
        12,
        "bag",
      ],
      [
        2,
        "Ridge Bottle",
        "Essentials",
        "ขวดน้ำเก็บอุณหภูมิ 750 ml สำหรับเส้นทางที่ยาวกว่าที่คิด",
        89000,
        18,
        "bottle",
      ],
      [
        3,
        "Nomad Headphones",
        "Tech",
        "หูฟังไร้สาย ตัดเสียงรบกวน ใช้งานได้ตลอดวัน",
        329000,
        7,
        "headphones",
      ],
      [
        4,
        "Camp Light",
        "Essentials",
        "โคมไฟพกพา แสงอบอุ่น ปรับระดับได้ พร้อมห่วงแขวน",
        129000,
        9,
        "lamp",
      ],
      [
        5,
        "Field Watch",
        "Tech",
        "นาฬิกาสำหรับทุกวัน หน้าปัดอ่านง่าย สายผ้าทนทาน",
        189000,
        1,
        "watch",
      ],
      [
        6,
        "Weekender Duffel",
        "Bags",
        "กระเป๋าสำหรับทริปสั้น ช่องใหญ่พร้อมสายสะพายถอดได้",
        289000,
        5,
        "duffel",
      ],
    ].forEach((v) => p.run(...v));
  });
}
