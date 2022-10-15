const express = require("express");
const {
  addSkill,
  updateSkill,
  removeSkill,
  listSkills,
} = require("../controllers/skillControllers");
const { protected } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/add").post(protected, addSkill);
router.route("/update/:skillId").patch(protected, updateSkill);
router.route("/remove/:skillId").delete(protected, removeSkill);
router.route("/list").get(protected, listSkills);

module.exports = router;
