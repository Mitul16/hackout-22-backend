const mongoose = require("mongoose");
const randomCSSColor = require("../utils/randomCSSColor");

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide tag name"],
  },
  color: {
    type: String,
    default: randomCSSColor(),
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
