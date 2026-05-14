const Task = require("../models/Task");

const asyncHandler = require("../utils/asyncHandler");

// ================= CREATE TASK =================
exports.createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
  } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const task = await Task.create({
    userId: req.user._id,
    title,
    description,
    priority,
    dueDate,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

// ================= GET ALL TASKS =================
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    userId: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// ================= GET SINGLE TASK =================
exports.getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    task,
  });
});

// ================= UPDATE TASK =================
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const {
    title,
    description,
    status,
    priority,
    progress,
    dueDate,
  } = req.body;

  task.title = title || task.title;

  task.description =
    description || task.description;

  task.status = status || task.status;

  task.priority = priority || task.priority;

  task.progress =
    progress !== undefined
      ? progress
      : task.progress;

  task.dueDate = dueDate || task.dueDate;

  // auto completedAt
  if (
    status === "completed" &&
    !task.completedAt
  ) {
    task.completedAt = new Date();

    // reward points
    req.user.points += 20;

    await req.user.save();
  }

  await task.save();

  res.json({
    success: true,
    task,
  });
});

// ================= DELETE TASK =================
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted",
  });
});