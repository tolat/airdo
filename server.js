// Load environment variables
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { MongoClient } = require("mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Connect to MongoDB
let db;
const uri = process.env.MONGO_URI; // Ensure you have a MONGO_URI in your .env file
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(process.env.DB_NAME); // Set your database name in .env
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Airdo Backend!");
});

// Example MongoDB API route
app.get("/api/data", async (req, res) => {
  try {
    const collection = db.collection("data");
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port: ${PORT}`));
