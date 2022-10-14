const mongoose = require('mongoose')


const projectSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true , "Provide project name"]
    },
    description : {
        type: String,
        required : [true , "Provide description"]
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        required : [true , "Project without author"]
    },
    skillsRequired: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    mentors: {
        type : [mongoose.Schema.Types.ObjectId],
    },
    developers: {
        type : [mongoose.Schema.Types.ObjectId],
    },
    deadline : {
        type : Date
    },
    openForMentors : {
        type : Boolean,
        default : true,
    },
    openForDevelopers : {
        type : Boolean,
        default : true,
    },
    features : {
        type : [mongoose.Schema.Types.ObjectId]
    }
});

const Project = mongoose.model('projectSchema', userSchema)

module.exports = Project