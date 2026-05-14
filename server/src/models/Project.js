const mongoose = require("mongoose");

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
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#5B8DEF",
    },

    icon: {
      type: String,
      default: "📁",
    },

    startDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Project",
  projectSchema
);