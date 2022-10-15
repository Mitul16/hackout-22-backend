const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // `taskId` can be `null` if the request is for - Applying in a Project
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  type: {
    type: String,
    required: true,
    enum: ["forTask", "toMentor", "toDevelop"],
  },
  expiry_date: {
    type: Date,
    default: Date.now() + 1000 * 604800, // 7 days
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
