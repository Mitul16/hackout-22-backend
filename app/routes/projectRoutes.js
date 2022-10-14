const express = require('express')
const router = express.Router()
const {
    addProject,
    updateProject,
    removeProject,
    listProject,
    listProjects,
    listRecommendedProjects,
} = require('../controllers/projectControllers')

router.route("/add").post(protected, addProject)
router.route("/:id").delete(protected, removeProject)
                    .put(protected, updateProject)
                    .get(listProject)

router.route("/list").get(listProjects)
router.route("/list_recommended").get(listRecommendedProjects)