const asyncHandler = require("express-async-handler");
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
    return responseCodes.response_201(res, "User updated succesfully!", user);
  } catch (error) {
    next(error);
  }
});
