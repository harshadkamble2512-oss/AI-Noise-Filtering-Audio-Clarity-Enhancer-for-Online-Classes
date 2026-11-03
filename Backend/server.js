require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "AI Classroom API is running",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URL || !process.env.JWT_SECRET) {
    console.error("MONGODB_URL and JWT_SECRET are required");
    process.exit(1);
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();