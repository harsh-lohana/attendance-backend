const mongoose = require("mongoose");
const Classroom = require("./classroomModel");
const Student = require("./studentModel");

const attendanceSchema = mongoose.Schema(
    {
        classroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom"
        },
        video: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Created", "Processing", "Marked"],
            default: "Created"
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }]
    },
    {
        timestamps: true
    }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;