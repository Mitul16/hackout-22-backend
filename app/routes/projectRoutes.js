const express = require('express')
const {
    addProject,
    updateProject,
    removeProject,
    } = require('../controllers/projectControllers')
const router = express.Router()


router.route("/add").post(protected, addProject)