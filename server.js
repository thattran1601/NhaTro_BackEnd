const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ======================
   API TEST
====================== */
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello từ backend NodeJS 🚀" });
});

/* ======================
   CLICK COUNTER
====================== */
let count = 0;

app.post("/api/click", (req, res) => {
  count++;
  res.json({ count });
});

/* ======================
   TEST MYSQL
====================== */
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "❌ DB lỗi",
        error: err
      });
    }

    res.json({
      message: "✅ DB OK",
      data: results
    });
  });
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`Server chạy tại port ${PORT}`);
});