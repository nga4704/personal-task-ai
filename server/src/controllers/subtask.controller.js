const Subtask = require("../models/Subtask");
const Task = require("../models/Task");

const asyncHandler = require("../utils/asyncHandler");

// ================= CREATE SUBTASK =================
exports.createSubtask = asyncHandler(
  async (req, res) => {
    const { taskId, title } = req.body;

    if (!taskId || !title) {
      return res.status(400).json({
        success: false,
        message: "Task ID and title are required",
      });
    }

    // check task exist
    const task = await Task.findOne({
      _id: taskId,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const subtask = await Subtask.create({
      taskId,
      title,
    });

    res.status(201).json({
      success: true,
      subtask,
    });
  }
);

// ================= GET SUBTASKS BY TASK =================
exports.getSubtasksByTask = asyncHandler(
  async (req, res) => {
    const { taskId } = req.params;

    // verify task owner
    const task = await Task.findOne({
      _id: taskId,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const subtasks = await Subtask.find({
      taskId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: subtasks.length,
      subtasks,
    });
  }
);

// ================= UPDATE SUBTASK =================
exports.updateSubtask = asyncHandler(
  async (req, res) => {
    const subtask = await Subtask.findById(
      req.params.id
    );

    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    // verify owner via task
    const task = await Task.findOne({
      _id: subtask.taskId,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { title, isCompleted } = req.body;

    if (title !== undefined)
      subtask.title = title;

    if (isCompleted !== undefined)
      subtask.isCompleted = isCompleted;

    await subtask.save();

    res.json({
      success: true,
      subtask,
    });
  }
);

// ================= DELETE SUBTASK =================
exports.deleteSubtask = asyncHandler(
  async (req, res) => {
    const subtask = await Subtask.findById(
      req.params.id
    );

    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    // verify owner
    const task = await Task.findOne({
      _id: subtask.taskId,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await subtask.deleteOne();

    res.json({
      success: true,
      message: "Subtask deleted",
    });
  }
);