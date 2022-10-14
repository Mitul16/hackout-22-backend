const express = require('express')
const { removeProject } = require('../controllers/projectControllers')
const router = express.Router()


router.route("/add").post(protected , addUser)
router.route("/projects/:id").delete(protected, removeProject)