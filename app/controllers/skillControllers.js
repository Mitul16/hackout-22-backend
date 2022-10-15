const asyncHandler = require("express-async-handler");
const Skill = require("../models/skillModel");

const {
  response_200,
  response_201,
  response_401,
  response_404,
  response_500,
  response_403,
} = require("../utils/responseCodes");

const addSkill = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, description } = req.body;

  try {
    const skill = await Skill.create({
      name,
      description,
    });

    return response_201(res, "Skill added!", skill);
  } catch (error) {
    return response_500(res, error);
  }
});

const updateSkill = asyncHandler(async (req, res) => {
  const user = req.user;
  const skillId = req.params.skillId;

  const skill = await Skill.findById(skillId);

  if (skill == null) {
    return response_404(res, "Skill not found!");
  }

  const { name, description } = req.body;

  try {
    // Any empty (null) fields will be ignored
    const skill = await Skill.findByIdAndUpdate(skillId, {
      name,
      description,
    });

    return response_200(res, "Skill updated!", skill);
  } catch (error) {
    return response_500(res, error);
  }
});

const removeSkill = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const skillId = req.params.skillId;

  const skill = await Skill.findById(skillId);

  if (skill == null) {
    return response_404(res, "Skill not found!");
  }

  try {
    await Skill.remove(skill);
    return response_200(res, "Skill removed!");
  } catch (error) {
    return response_500(res, "Error while removing skill", error);
  }
});

const listSkills = asyncHandler(async (req, res, next) => {
  try {
    const skills = await Skill.find();
    return response_200(res, "Skills listed!", skills);
  } catch (error) {
    return response_500(res, "Error while fetching skills", error);
  }
});

module.exports = {
  addSkill,
  updateSkill,
  removeSkill,
  listSkills,
};
