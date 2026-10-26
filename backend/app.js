import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// 1. CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
  })
);

// 2. Parse request body — ต้องอยู่ก่อน Routes
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// 3. Validate Login API
app.post("/api/auth/login", async (req, res) => {
  try {
    // ป้องกัน req.body เป็น undefined
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body."
      });
    }

    const { username, password, remember = false } = body;

    // ตรวจสอบ username
    if (typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
        errors: {
          username: "Please enter your username."
        }
      });
    }

    if (username.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Username must not exceed 100 characters."
      });
    }

    // ตรวจสอบ password
    if (typeof password !== "string" || password.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
        errors: {
          password: "Please enter your password."
        }
      });
    }

    if (password.length > 1024) {
      return res.status(400).json({
        success: false,
        message: "Invalid password format."
      });
    }

    // ตรวจสอบ remember
    if (typeof remember !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Remember must be a boolean."
      });
    }

    // TODO: ตรวจสอบบัญชีจากฐานข้อมูลจริง
    // ห้ามถือว่าผ่าน Login เพียงเพราะ Validation ผ่าน

    return res.status(501).json({
      success: false,
      message: "Authentication is not implemented yet."
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
});

// 4. Handle malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  next(err);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
