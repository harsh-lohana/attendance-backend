const mongoose = require("mongoose");

const classroomSchema = mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }]
    },
    {
        timestamps: true,
    }
);

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;