const asyncHandler = require("express-async-handler");
const {
  response_200,
  response_201,
  response_400,
  response_403,
  response_404,
  response_500,
} = require("../utils/responseCodes");

const Project = require("../models/projectModel");
const User = require("../models/userModel");

exports.addProject = asyncHandler(async (req, res, next) => {
  try {
    const owner = req.user;
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      authorId: owner._id,
      deadline: req.body.deadline,
      openForMentors: req.body.openForMentors,
      openForDevelopers: req.body.openForDevelopers,
      developers: [owner._id],
    });
    const data = await newProject.save().exec();
    return response_201(res, "Project created succesfully!", data);
  } catch (error) {
    return response_500(res, error);
  }
});

exports.removeProject = asyncHandler(async (req, res, next) => {
  const authuser = req.user;
  const project = await Project.findById(req.params.id).exec();
  if (!project) {
    return response_404(res, "project does not exist");
  }
  if (project.authorId != authuser._id) {
    return response_400(res, "user is not project author");
  }
  try {
    response_201(
      res,
      "success",
      await Task.deleteOne({ _id: req.params.id }).exec()
    );
  } catch (error) {
    next(error);
  }
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const authuser = req.user;
  try {
    const project = await Project.findById(req.params.id).exec();
    if (!project) {
      return response_404(res, "project does not exist");
    }
    if (project.authorId != authuser._id) {
      return response_400(res, "user is not project author");
    }
    const queryResponse = await Project.updateOne(
      { _id: req.params.id },
      req.body
    );
    response_200(res, "success", queryResponse);
  } catch (error) {
    next(error);
  }
});

exports.listProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  return response_200(res, "Project fetched!", project);
});

exports.listProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find();
  return response_200(res, "Projects listed!", projects);
});

exports.listRecommendedProjects = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const projects = await Project.find();

  const processedProjects = projects.forEach((project) => {
    let skillsCount = 0;

    user.skills.forEach((skill) => {
      if (project.skills.indexOf(skill) != -1) {
        skillsCount += 1;
      }
    });

    return [skillsCount, project];
  });

  const sortedProjects = processedProjects.sort().reverse();
  const recommendedProjects = sortedProjects.slice(
    0,
    Math.min(8, sortedProjects.length)
  );
  return response_200(res, "Recommended projects listed!", recommendedProjects);
});
