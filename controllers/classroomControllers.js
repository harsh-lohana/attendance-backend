const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Classroom = require("../models/classroomModel");
const asyncHandler = require("express-async-handler");
const { getClassroomAttendance } = require("./attendanceControllers");

const createClassroom = asyncHandler(async (req, res) => {
    const { teacherID, subject } = req.body;
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
    const { studentID } = req.query;

    const student = await Student.findById(studentID);
    if (!student) {
        res.status(400);
        throw new Error("Student not found!");
    }

    const classrooms = await Classroom.find({ students: studentID }).populate("teacher");
    if (classrooms) {
        res.status(200).json(classrooms);
    } else {
        res.status(400);
        throw new Error("Classrooms not found!");
    }

})

const getAvailableClassrooms = asyncHandler(async (req, res) => {
    const { studentID } = req.query;

    const student = await Student.findById(studentID);
    if (!student) {
        res.status(400);
        throw new Error("Student not found!");
    }

    const prefix = "B" + (["CSE", "ETC", "EEE", "IT", "CE"].indexOf(student.branch) + 1) + (25 - student.year) + ": ";

    const classrooms = await Classroom.find({ subject: { $regex: `^${prefix}`, $options: 'i' } }).populate("teacher");
    if (classrooms) {
        res.status(200).json(classrooms);
    } else {
        res.status(400);
        throw new Error("Classrooms not found!");
    }

})

const getTeacherClassrooms = asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    const teacher = await Teacher.findById(teacherID);
    if (!teacher) {
        res.status(400);
        throw new Error("Teacher not found!");
    }

    const classrooms = await Classroom.find({ teacher: teacherID }).populate("teacher");
    if (classrooms) {
        res.status(200).json(classrooms);
    } else {
        res.status(400);
        throw new Error("Classrooms not found!");
    }

})

const getClassroomByID = asyncHandler(async (req, res) => {
    const { classroomID } = req.query;
    const classroom = await Classroom.findById(classroomID).populate("teacher");
    if (classroom) {
        res.status(200).json(classroom);
    } else {
        res.status(400);
        throw new Error("Classroom not found!");
    }
})

module.exports = { createClassroom, joinClassroom, getStudentClassrooms, getTeacherClassrooms, getAvailableClassrooms, getClassroomByID };