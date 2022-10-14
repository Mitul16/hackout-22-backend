const express = require('express')
const {
  addTask,
  updateTask,
  removeTask,
  listProjectTasks,
  listUserTasks,
} = require('../controllers/taskControllers')
const { protected } = require("../middlewares/authMiddleware")
const router = express.Router()

router.route('/add/:projectId').post(protected, addTask)
router.route('/update/:taskId').update(protected, updateTask)
router.route('/remove/:taskId').delete(protected, removeTask)
router.route('/list/project/:projectId').get(protected, listProjectTasks)
router.route('/list/user/:userId').get(protected, listUserTasks)

module.exports = router
