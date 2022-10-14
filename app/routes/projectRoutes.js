const express = require('express')
const router = express.Router()
const {
    addProject,
    updateProject,
    removeProject,
} = require('../controllers/projectControllers')

router.route("/add").post(protected, addProject)
router.route("/:id").delete(protected, removeProject)
                    .put(protected, updateProject)
