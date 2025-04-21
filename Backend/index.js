// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getCSVFile } = require("./s3");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    const parsedData = await getCSVFile(); // Already parsed rows
    res.json(parsedData); // Send JSON to frontend
  } catch (error) {
    console.error("Failed to fetch CSV data:", error);
    res.status(500).send("Failed to fetch CSV data");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
