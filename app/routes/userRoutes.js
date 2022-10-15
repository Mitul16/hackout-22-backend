const express = require("express");
const {
  editUserController,
  getUser,
} = require("../controllers/userControllers");
const router = express.Router();
const { protected } = require("../middlewares/authMiddleware");

router.route("/edit").post(protected, editUserController);
router.route("/get-user").get(protected, getUser);
router.route("/get-user/:id").get(getUser);

module.exports = router;
