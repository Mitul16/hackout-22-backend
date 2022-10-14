const express = require('express')
const router = express.Router()
const {
    addProject,
    updateProject,
    removeProject,
} = require('../controllers/projectControllers')

router.route("/projects/add").post(protected, addProject)
router.route("/projects/:id").delete(protected, removeProject)
