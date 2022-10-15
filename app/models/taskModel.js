const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide project name"],
  },
  description: {
    type: String,
    required: [true, "Provide description"],
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  deadline: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
