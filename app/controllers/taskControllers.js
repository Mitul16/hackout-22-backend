const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

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
    return response_403(
      res,
      "You don't have access to add a task, contact the project author."
    );
  }

  try {
    const task = await Task.create({
      projectId,
      mentorId: user._id,
      name,
      description,
      skills,
      deadline,
    });

    return response_201(res, "Task added!", task);
  } catch (error) {
    return response_500(res, error);
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const user = req.user;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);

  if (task == null) {
    return response_404(res, "Task not found!");
  }

  const project = await Project.findById(task.projectId);
  const { name, description, skills, deadline } = req.body;

  // NOTE: This check is redundant, there shouldn't be any defunct tasks
  if (project == null) {
    return response_404(res, "Invalid project!");
  }

  // Check if the user has access
  if (project.mentors.indexOf(user._id) == -1) {
    return response_403(
      res,
      "You don't have access to update a task, contact the project author."
    );
  }

  try {
    // Any empty (null) fields will be ignored
    const task = await Task.findByIdAndUpdate(taskId, {
      name,
      description,
      skills,
      deadline,
    });

    return response_200(res, "Task updated!", task);
  } catch (error) {
    return response_500(res, error);
  }
});

const removeTask = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);

  if (task == null) {
    return response_404(res, "Task not found!");
  }

  const project = await Project.findById(task.projectId);
  if (project == null) {
    return response_404(res, "Invalid project!");
  }

  try {
    await Task.remove(task);
    return response_200(res, "Task removed!");
  } catch (error) {
    return response_500(res, "Error while removing task", error);
  }
});

const listProjectTasks = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  try {
    const projectTasks = await Task.find({
      projectId,
    });

    return response_200(res, "Project tasks listed!", projectTasks);
  } catch (error) {
    return response_500(res, "Error while fetching project tasks", error);
  }
});

const listUserTasks = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (user == null) {
    return response_404(res, "User not found!");
  }

  try {
    const tasksCreated = await Task.find({
      mentorId: userId,
    });

    const tasksAssigned = await Task.find({
      developerId: userId,
    });

    const tasks = {
      tasksCreated,
      tasksAssigned,
    };

    return response_200(res, "User tasks listed!", tasks);
  } catch (error) {
    return response_500(res, "Error while fetching user tasks", error);
  }
});

const applyForTask = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  
  if (task == null) {
    return response_404(res, "Task not found!");
  }

  const project = await Project.findById(task.projectId);

  if (project == null) {
    return response_404(res, "Invalid project!");
  }

  const earlierRequest = await Request.findOne({
    creatorId: user._id,
    projectId: project.id,
    taskId: taskId,
  });

  if (earlierRequest != null) {
    return response_401(res, "You have already requested for this task.");
  }

  try {
    const request = await Request.create({
      creatorId: user._id,
      projectId: project.id,
      taskId,
      type: "forTask",
    });

    // TODO: Send mail here!
    sendEMail({
      to: "adityarubbers.AV@gmail.com",
      subject: "Someone has applied for a task on your project",
      text: "this is a test email",
    });
    return response_200(res, "Task application request created!", request);
  } catch (error) {
    return response_500(res, "Error while creating application request", error);
  }
});

const removeUserFromTask = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const targetUserId = req.body.userId, taskId = req.body.taskId;

  const task = await Task.findById(taskId);

  if (task == null) {
    return response_404(res, "Task not found!");
  }

  const targetUser = await User.findById(targetUserId);

  if (targetUser == null) {
    return response_404(res, "User not found!");
  }

  const project = await Project.findById(task.projectId);

  if (project == null) {
    return response_404(res, "Project not found!");
  }

  if (project.mentors.indexOf(user._id) == -1) {
    return response_403(res, "You don't have access to remove a user from a task.");
  }

  try {
    task.developerId = null;
    await task.save();
  }
  catch (error) {
    return response_500(res, "Error while removing user from a task", error);
  }

  return response_200(res, "User removed from the task.");
})

module.exports = {
  addTask,
  updateTask,
  removeTask,
  listProjectTasks,
  listUserTasks,
  applyForTask,
  removeUserFromTask,
};
