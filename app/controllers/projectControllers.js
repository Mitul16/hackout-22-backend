const asyncHandler = require("express-async-handler");
const {
  response_200,
  response_201,
  response_400,
  response_403,
  response_404,
  response_500,
  response_401,
} = require("../utils/responseCodes");

const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Request = require("../models/requestModel");
const { sendEMail } = require("../utils/sendMail");

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
    const data = await newProject.save();
    return response_201(res, "Project created successfully!", data);
  } catch (error) {
    return response_500(res, error);
  }
});

exports.removeProject = asyncHandler(async (req, res, next) => {
  const authuser = req.user;
  const project = await Project.findById(req.params.id).exec();

  if (!project) {
    return response_404(res, "Project does not exist");
  }

  if (!project.authorId.equals(authuser._id)) {
    return response_403(res, "You are not project author");
  }

  try {
    response_201(
      res,
      "Project removed!",
      await Project.deleteOne({ _id: req.params.id }).exec()
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
      return response_404(res, "Project does not exist");
    }

    if (!project.authorId.equals(authuser._id)) {
      return response_400(res, "You are not project author");
    }

    const queryResponse = await Project.updateOne(
      { _id: req.params.id },
      req.body // FIXME: Not safe, sanitize first
    );

    return response_200(res, "Project updated!", queryResponse);
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

  return response_200(res, "Project listed!", project);
});

exports.listProjects = asyncHandler(async (req, res, next) => {
  try {
    const projects = await Project.find();
    return response_200(res, "Projects listed!", projects);
  } catch (error) {
    console.log(error);
  }
});

exports.listRecommendedProjects = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const openProjects = await Project.find({
    isCompleted: false,
  });

  const processedProjects = openProjects.map((project) => {
    let skillsCount = 0;

    user.skills.forEach((skill) => {
      if (project.skills.indexOf(skill) != -1) {
        skillsCount += 1;
      }
    });

    return [skillsCount, project];
  });

  // Select at most the top 8 projects based on the user's skills
  const sortedProjects = processedProjects.sort().reverse();
  const recommendedProjects = sortedProjects.slice(
    0,
    Math.min(8, sortedProjects.length)
  );

  return response_200(res, "Recommended projects listed!", recommendedProjects);
});

exports.applyForProject = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { role, id } = req.body;

  if (role != "mentor" && role != "developer") {
    return response_400(res, "Invalid role!");
  }

  const project = await Project.findById(id);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  const earlierRequest = await Request.findOne({
    creatorId: user._id,
    projectId: project.id,
  });

  if (earlierRequest != null) {
    return response_401(res, "You have already requested for this project.");
  }

  try {
    const request = await Request.create({
      creatorId: user._id,
      projectId: project.id,
      type: role == "mentor" ? "toMentor" : "toDevelop",
    });

    // TODO: Send mail here!
    sendEMail({
      to: "adityarubbers.AV@gmail.com",
      subject: "Someone has applied for your project",
      text: "this is a test email",
    });
    return response_200(res, "Project application request created!", request);
  } catch (error) {
    return response_500(res, "Error while creating application request", error);
  }
});
