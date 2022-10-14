const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

const {
  response_200,
  response_201,
  response_401,
  response_404,
  response_500,
  response_403,
} = require("../utils/responseCodes");

const addTask = asyncHandler(async (req, res) => {
  const user = req.user;
  const projectId = req.params.projectId;

  const project = await Project.findById(projectId);
  const { name, description, skills, deadline } = req.body;

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  if (project.mentors.indexOf(user._id) == -1) {
    return response_403(res, "You don't have access to add a task, contact the project author.")
  }

  try {
    const task = await Task.create({
      projectId,
      name,
      description,
      skills,
      deadline,
    });

    return response_201(res, "Task added!", task)
  }
  catch (error) {
    return response_500(res, error)
  }
});

module.exports = {
  addTask,
  updateTask,
  removeTask,
  listProjectTasks,
  listUserTasks,
};
