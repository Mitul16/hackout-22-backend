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
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  deadline: {
    type: Date,
  },
  isAssigned: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
