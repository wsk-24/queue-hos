import express from "express";

const app = express();

app.use(express.json());

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    // TODO:
    // 1. ค้นหาผู้ใช้จากฐานข้อมูล
    // 2. ตรวจสอบรหัสผ่านด้วย bcrypt หรือ Argon2
    // 3. สร้าง session หรือ token หลังยืนยันตัวตนสำเร็จ

    // ห้ามใช้ตัวอย่างนี้เป็นระบบ Authentication จริง
    // จนกว่าจะเชื่อมต่อฐานข้อมูลและตรวจสอบรหัสผ่านเรียบร้อย

    return res.status(501).json({
      message: "Authentication is not implemented yet."
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error."
    });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
