# คู่มือหาไฟล์ที่ต้องแก้

## แก้หน้าตา

แก้ frontend/pages/<ชื่อหน้า>/index.html สำหรับโครงหน้า
แก้ frontend/pages/<ชื่อหน้า>/page.css สำหรับหน้าตาเฉพาะหน้านั้น
แก้ frontend/pages/<ชื่อหน้า>/page.js สำหรับการทำงานของหน้านั้น
สีหลักอยู่ frontend/shared/styles/theme.css; component พื้นฐานอยู่ base.css
เมนูที่ใช้ร่วมกันอยู่ frontend/shared/layout/shell.js

## แก้ระบบ

เริ่มที่ backend/features/<ชื่อฟีเจอร์>/
_.routes.mjs = endpoint และการส่งข้อมูลเข้าออก
_.service.mjs = เงื่อนไขธุรกิจและสิทธิ์
_.repository.mjs = SQL และการเข้าถึงข้อมูล
_.validation.mjs = validation ของฟีเจอร์ที่มีแบบฟอร์มหลายช่อง
ไม่ใส่กฎธุรกิจลงใน backend/server.mjs

## แก้ฐานข้อมูล

โครงสร้างตาราง: database/schema/
ข้อมูลเริ่มต้น: database/seed.mjs (แก้ไฟล์นี้ไม่เปลี่ยนข้อมูลเดิมที่สร้างไปแล้ว)
ข้อมูลที่บันทึกจริง: database/data/app.sqlite
ก่อนเปลี่ยน schema ให้สำรองไฟล์ฐานข้อมูลและสร้าง migration สำหรับข้อมูลเดิม
อย่าลบฐานข้อมูลเพื่อเปลี่ยนข้อมูลของผู้ใช้โดยไม่ตั้งใจ

## หน้าที่มีในโปรเจกต์

home = หน้าร้าน; cart = ตะกร้า; checkout = ยืนยันคำสั่งซื้อ; my-orders = ออเดอร์ลูกค้า; dashboard = หลังบ้านภาพรวม; products = สินค้าและสต๊อก; orders = จัดส่ง/ยกเลิก/คืนสินค้า; employees = พนักงานและสิทธิ์

## เพิ่มหน้าใหม่

สร้างโฟลเดอร์ใน frontend/pages/ และแยกสามไฟล์ตามตัวอย่างเดิม
ใช้ shared shell และ api client แทนการคัดลอกเมนู/API ไปทุกหน้า
ถ้าต้องเพิ่ม API ให้แยกฟีเจอร์ใน backend/features/ แล้ว import routes ใน server.mjs
