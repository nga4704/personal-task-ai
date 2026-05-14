const express = require("express");

const router = express.Router();

const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  deleteSubtask,
} = require("../controllers/subtask.controller");

const {
  protect,
} = require("../middlewares/auth.middleware");

// protected routes
router.use(protect);

router.post("/", createSubtask);

router.get(
  "/task/:taskId",
  getSubtasksByTask
);

router.put("/:id", updateSubtask);

router.delete("/:id", deleteSubtask);

module.exports = router;