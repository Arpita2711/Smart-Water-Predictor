// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto"); // For signature verification (optional)

const { getCSVFile } = require("./s3");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf; // Store raw body for signature verification
  }
}));

// ML route
const mlRoute = require('./mlRoute');
app.use(mlRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Smart Water Quality Backend is running!");
});

// Fetch processed CSV data
app.get("/api/data", async (req, res) => {
  try {
    const parsedData = await getCSVFile();
    res.json(parsedData);
  } catch (error) {
    console.error("Failed to fetch CSV data:", error);
    res.status(500).send("Failed to fetch CSV data");
  }
});

// Webhook route
app.post("/webhook", (req, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET; // Optional: put your secret in .env
  const signature = req.headers["x-hub-signature-256"];

  if (secret && signature) {
    const hash = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex")}`;

    if (hash !== signature) {
      console.warn("⚠️  Invalid webhook signature!");
      return res.status(401).send("Invalid signature");
    }
  }

  console.log("✅ GitHub webhook received:", req.body);

  // Do something with the event (e.g., pull latest code, trigger redeploy, etc.)

  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

