const asyncHandler = require("express-async-handler");
const {
  response_200,
  response_403,
  response_404,
} = require("../utils/responseCodes");

const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

exports.editUserController = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    const description = req.body.description;
    const skills = req.body.skills;
    const github = req.body.github;
    await User.findByIdAndUpdate(user._id, {
      description,
      skills,
      github,
    }).exec();
    return responseCodes.response_201(res, "User updated successfully!", user);
  } catch (error) {
    next(error);
  }
});

exports.getUser = asyncHandler(async (req, res, next) => {
  // TODO: Remove sensitive information like `password`
  const user = req.user || await User.findById(req.params.id);
  const userId = user._id;

  const userProjects = await Project.find({
    developers: {
      $elemMatch: {
        $eq: userId
      },
    },
  });

  const completedProjects = [], ongoingProjects = [];
  userProjects.forEach(project => {
    if (project.isCompleted) {
      completedProjects.push(project);
    }
    else {
      ongoingProjects.push(project);
    }
  })

  let userInformation = {
    user,
    completedProjects,
    ongoingProjects,
  };

  return response_200(res, "User information fetched!", userInformation);
})