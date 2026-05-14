const Project = require("../models/Project");

const asyncHandler = require("../utils/asyncHandler");

// ================= CREATE PROJECT =================
exports.createProject = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      color,
      icon,
      startDate,
      dueDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const project = await Project.create({
      userId: req.user._id,
      title,
      description,
      color,
      icon,
      startDate,
      dueDate,
    });

    res.status(201).json({
      success: true,
      project,
    });
  }
);

// ================= GET ALL PROJECTS =================
exports.getProjects = asyncHandler(
  async (req, res) => {
    const projects = await Project.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  }
);

// ================= GET SINGLE PROJECT =================
exports.getProjectById = asyncHandler(
  async (req, res) => {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  }
);

// ================= UPDATE PROJECT =================
exports.updateProject = asyncHandler(
  async (req, res) => {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const {
      title,
      description,
      color,
      icon,
      startDate,
      dueDate,
    } = req.body;

    project.title = title || project.title;

    project.description =
      description || project.description;

    project.color = color || project.color;

    project.icon = icon || project.icon;

    project.startDate =
      startDate || project.startDate;

    project.dueDate =
      dueDate || project.dueDate;

    await project.save();

    res.json({
      success: true,
      project,
    });
  }
);

// ================= DELETE PROJECT =================
exports.deleteProject = asyncHandler(
  async (req, res) => {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted",
    });
  }
);