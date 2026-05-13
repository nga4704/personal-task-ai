import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    color: String,
    icon: String,

    startDate: Date,
    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);