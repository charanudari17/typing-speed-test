 // importing required modules
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./db/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
   
// Write your MongoDB connection string here

connectDB();

// Complete the schema and model for storing scores
const Score = mongoose.model("Score", new mongoose.Schema({
  name: String,
  wpm: Number
}));

// Complete the endpoint to save new score
app.post("/score", async (req, res) => {
  try {
    const { name, wpm } = req.body;

    // Check if user exists
    const existing = await Score.findOne({ name: name });

    // If user doesn't exist, create new entry.
    // If exists, update only if new WPM is higher
    if (!existing) {
      // User not in DB, create new entry
      const score = new Score({ name, wpm });
      await score.save();
    } else if (wpm > existing.wpm) {
      // Update only if new WPM is higher
      existing.wpm = wpm;
      await existing.save();
    }

    const leaderboard = await Score
      .find()
      .sort({ wpm: -1 });

    res.json({ leaderboard });

  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Complete the endpoint to get leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Score
      .find()
      .sort({ wpm: -1 });

    res.json({ leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on Port Number ${PORT}`);
});