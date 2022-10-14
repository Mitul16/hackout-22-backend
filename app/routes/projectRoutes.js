const express = require('express')
const router = express.Router()


router.route("/add").post(protected , addUser)