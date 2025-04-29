require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("./models/admin"); 

// Models
const Conversation = require("./models/conversation");
const Message = require("./models/message");

// Initialize Express
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  "/widget",
  express.static(path.join(__dirname, ".", "public", "widget"))
);

// Initialize Socket.IO (do not listen on a port)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

// Socket.IO connection
io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  // Your socket logic...
});

// API Endpoints
app.get("/api/conversations", async (req, res) => {
  // Endpoint logic...
});

app.get("/api/conversations/:id", async (req, res) => {
  // Endpoint logic...
});

// More endpoints as needed...

// Test Gemini connection (optional debug endpoint)
app.get("/test-ai", async (req, res) => {
  try {
    const result = await model.generateContent(["Test message from backend"]);
    const text = result.response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gemini AI test failed");
  }
});

// Export the app as a serverless function for Vercel
module.exports = (req, res) => {
  app(req, res); // Vercel will handle the request/response
};
