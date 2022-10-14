const express = require('express')
const { TestExample } = require('../controllers/exampleController')
const { protected } = require('../middlewares/authMiddleware')
const router = express.Router()

router.route('/').get(protected, TestExample)

module.exports = router
