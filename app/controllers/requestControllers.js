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

const Request = require("../models/requestModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

exports.acceptRequest = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const requestId = req.params.requestId;
  const request = await Request.findById(requestId);

  if (request == null) {
    return response_404(res, "Invalid request!");
  }

  const project = await Project.findById(request.projectId);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  if (request.type == "toMentor" || request.type == "toDevelop") {
    // NOTE: Only the project author can manage project requests
    if (!project.authorId.equals(user._id)) {
      return response_403(
        res,
        "You don't have access to add a task, contact the project author."
      );
    }

    if (request.type == "toMentor") {
      if (project.mentors.indexOf(request.creatorId) != -1) {
        return response_401(res, "You are already mentoring this project.");
      }

      project.mentors.push(request.creatorId);
    } else if (request.type == "toDevelop") {
      if (project.developers.indexOf(request.creatorId) != -1) {
        return response_401(res, "You are already developing this project.");
      }

      project.developers.push(request.creatorId);
    }

    await project.save();
  } else if (request.type == "forTask") {
    // NOTE: Only mentors of a project can manage task requests
    if (project.mentors.indexOf(user._id) == -1) {
      return response_403(
        res,
        "You don't have access to assign a task, contact the project author."
      );
    }

    const task = await Task.findById(request.taskId);

    if (task == null) {
      return response_404(res, "Task not found!");
    }

    if (task.developerId != null) {
      return response_401(res, "Task was already assigned!");
    }

    task.developerId = request.creatorId;
    await task.save();
  }

  // Delete the pending request
  await Request.remove(request);
  return response_200(res, "Request accepted!");
});

exports.rejectRequest = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const requestId = req.params.requestId;
  const request = await Request.findById(requestId);

  if (request == null) {
    return response_404(res, "Invalid request!");
  }

  const project = await Project.findById(request.projectId);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  if (request.type == "toMentor" || request.type == "toDevelop") {
    // NOTE: Only the project author can manage project requests
    if (!project.authorId.equals(user._id)) {
      return response_403(
        res,
        "You don't have access to add a task, contact the project author."
      );
    }
  } else if (request.type == "forTask") {
    // NOTE: Only mentors of a project can manage task requests
    if (project.mentors.indexOf(user._id) == -1) {
      return response_403(
        res,
        "You don't have access to assign a task, contact the project author."
      );
    }
  }

  // Delete the pending request
  await Request.remove(request);
  return response_200(res, "Request rejected!");
});
