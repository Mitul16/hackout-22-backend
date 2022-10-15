const express = require("express");
const {
  addTask,
  updateTask,
  removeTask,
  listProjectTasks,
  listUserTasks,
  applyForTask,
  removeUserFromTask,
} = require("../controllers/taskControllers");
const { protected } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/add/:projectId").post(protected, addTask);
router.route("/update/:taskId").patch(protected, updateTask);
router.route("/remove/:taskId").delete(protected, removeTask);
router.route("/list/project/:projectId").get(protected, listProjectTasks);
router.route("/list/user/:userId").get(protected, listUserTasks);
router.route("/apply/:taskId").post(protected, applyForTask);
router.route("/remove-user/").delete(protected, removeUserFromTask);

module.exports = router;
