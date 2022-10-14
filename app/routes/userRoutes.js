const express = require("express");
const {editUserController} = requre("../controllers/userControllers");
const router = express.Router();
const protected = require("../middlewares/authMiddleware");

router.route("/edit").post(protected ,  editUserController);

module.exports = router;