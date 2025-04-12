const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Classroom = require("../models/classroomModel");
const asyncHandler = require("express-async-handler");

const createClassroom = asyncHandler(async (req, res) => {
    const { teacherID, subject } = req.body;
    console.log(teacherID, subject)
    const teacher = await Teacher.findById(teacherID);

    if (!teacher) {
        res.status(400);
        throw new Error("Student not found!");
    }

    const classroom = await Classroom.create({ teacher: teacherID, subject });

    if (classroom) {
        res.status(201).json({
            _id: classroom._id,
            teacher: classroom.teacher,
            subject: classroom.subject,
        });
    } else {
        res.status(400);
        throw new Error("Classroom not found!");
    }
});

const joinClassroom = asyncHandler(async (req, res) => {
    const { studentID, classroomID } = req.body;

    const student = await Student.findById(studentID);
    if (!student) {
        res.status(400);
        throw new Error("Student not found!");
    }

    const classroom = await Classroom.findById(classroomID);
    if (!classroom) {
        res.status(400);
        throw new Error("Classroom not found!");
    }
    console.log(student)
    console.log(classroom)
    if (!classroom.students.includes(student._id)) {
        classroom.students.push(student._id);
        await classroom.save();
        res.status(200).json(classroom);
    }
    else {
        res.status(400).json({
            message: "Student already present in Classroom"
        });
    }
});

const getStudentClassrooms = asyncHandler(async (req, res) => {
    const { studentID } = req.body;

    const student = await Student.findById(studentID);
    if (!student) {
        res.status(400);
        throw new Error("Student not found!");
    }

    const classrooms = await Classroom.find({ students: studentID });
    if (classrooms) {
        res.status(201).json(classrooms);
    } else {
        res.status(400);
        throw new Error("Classrooms not found!");
    }

})

module.exports = { createClassroom, joinClassroom, getStudentClassrooms };