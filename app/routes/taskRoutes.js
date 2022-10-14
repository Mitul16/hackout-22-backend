const express = require('express')
const {
  addTask,
  updateTask,
  removeTask,
  listProjectTasks,
} = require('../controllers/taskControllers')
const router = express.Router()

router.route('/add/:projectId').post(protected, addTask)
router.route('/update/:taskId').update(protected, updateTask)
router.route('/remove/:taskId').delete(protected, removeTask)
router.route('/list/project/:projectId').get(listProjectTasks)
router.route('/list/user/:userId').get(listUserTasks)

module.exports = router
