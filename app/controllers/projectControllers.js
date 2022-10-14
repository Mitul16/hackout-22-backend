const asyncHandler = require("express-async-handler")
const responseCodes = require("../utils/responseCodes")
const Project = require("../models/projectModel")
const User = require("../models/userModel")

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
        return responseCodes.response_404(res, "project does not exist");
    }
    if (project.authorId != authuser._id) {
        return responseCodes.response_400(res, "user is not project author");
    }
    try {
        responseCodes.response_201(
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
            return responseCodes.response_404(res, "project does not exist");
        }
        if (project.authorId != authuser._id) {
            return responseCodes.response_400(res, "user is not project author");
        }
        const queryResponse = await Project.updateOne({ _id: req.params.id }, req.body);
        responseCodes.response_200(res, "success", queryResponse);
    } catch (error) {
        next(error);
    }
});