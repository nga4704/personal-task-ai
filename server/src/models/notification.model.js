import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["reminder", "deadline", "ai_suggestion"],
      default: "reminder",
    },

    relatedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    remindAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);