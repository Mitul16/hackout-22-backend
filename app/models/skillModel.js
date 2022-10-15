const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide skill name"],
  },
  description: {
    type: String,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
