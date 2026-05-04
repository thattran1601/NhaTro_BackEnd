const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API test
app.get("/api/message", (req, res) => {
    res.json({ message: "Hello từ backend NodeJS 🚀" });
});

// API đếm số lần click
let count = 0;

app.post("/api/click", (req, res) => {
    count++;
    res.json({ count });
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});