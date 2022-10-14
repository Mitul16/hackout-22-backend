const asyncHandler = require("express-async-handler")
const responseCodes = require("../utils/responseCodes")
const Project = require("../models/projectModel")
const User = require("../models/userModel")

exports.addProject = async(req,res) => {
    const user = req.user;
    
}

exports.removeProject = asyncHandler(async (req, res, next) => {
    const authuser = req.user
    const project = await Project.findById(req.params.id).exec()
    if (!project) {
        return responseCodes.response_404(res, "project does not exist")
    }
    if (project.authorId != authuser._id) {
        return responseCodes.response_400(res, "user is not project author")
    }
    try {
        responseCodes.response_201(
            res,
            "success",
            await Task.deleteOne({ _id: req.params.id }).exec()
        )
    } catch (error) {
        next(error)
    }
})