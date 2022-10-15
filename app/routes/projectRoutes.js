const express = require("express");
const router = express.Router();
const {
  addProject,
  updateProject,
  removeProject,
  listProject,
  listProjects,
  listRecommendedProjects,
  applyForProject,
} = require("../controllers/projectControllers");

const { protected } = require("../middlewares/authMiddleware");

router.route("/add").post(protected, addProject);
router
  .route("/:id")
  .delete(protected, removeProject)
  .put(protected, updateProject)
  .get(protected, listProject);

router.route("/list").get(protected, listProjects);
router.route("/list_recommended").get(protected, listRecommendedProjects);
router.route("/apply/:projectId").post(protected, applyForProject);

module.exports = router