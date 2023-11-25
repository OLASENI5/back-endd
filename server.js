require('dotenv').config();


// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create an instance of the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(express.json()); // Allows the server to parse JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);


// Define the data structure (schema)
const commentSchema = new mongoose.Schema({
  user: {
    id: String,
    name: String,
  },
  createdAt: { type: Date, default: Date.now },
  desc: String,
});

// Create a model based on the schema
const Comment = mongoose.model("Comment", commentSchema);

// Get comments
app.get("/api/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new comment
app.post("/api/comments", async (req, res) => {
  const { user, desc } = req.body;

  try {
    const newComment = new Comment({ desc, user });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a comment
app.delete("/api/comments/:id", async (req, res) => {
  const commentId = req.params.id;

  try {
    await Comment.findByIdAndRemove(commentId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Continue with your server logic below...
