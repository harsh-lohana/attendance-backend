const express = require("express");
const { createClassroom, joinClassroom, getStudentClassrooms, getTeacherClassrooms, getAvailableClassrooms, getClassroomByID } = require("../controllers/classroomControllers");

const router = express.Router();

// router.get("/", (req, res) => { res.send("Classroom") });
router.post("/create", createClassroom);
router.post("/join", joinClassroom);
router.get("/", getClassroomByID);
router.get("/student", getStudentClassrooms);
router.get("/student/available", getAvailableClassrooms);
router.get("/teacher", getTeacherClassrooms);

module.exports = router;
