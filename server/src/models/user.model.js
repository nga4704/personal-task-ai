import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // 🔥 Gamification
    streakCount: {
      type: Number,
      default: 0,
    },

    lastCompletedDate: {
      type: Date,
    },

    totalPoints: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    // 🤖 Future AI
    productivityScore: {
      type: Number,
      default: 0,
    },

    preferredWorkTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      default: "evening",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);