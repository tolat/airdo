// Load environment variables
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { MongoClient } = require("mongodb");
const OpenAIApi = require("openai");

const app = express();

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, "client/dist")));

// Catch-all route to serve the React app's `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

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

// OpenAI API Configuration
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in .env
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Airdo Backend!");
});

// ChatGPT API Route
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = response.choices[0].message.content.trim();

    try {
      JSON.parse(rawResponse);
      res.json({ message: rawResponse }); // Send directly if valid JSON
    } catch {
      res.json({ message: JSON.stringify(rawResponse) }); // Wrap in JSON if plain text
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({
      error: "Failed to fetch response from OpenAI API",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on port: ${PORT}`));
