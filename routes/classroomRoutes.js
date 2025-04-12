const express = require("express");
const { createClassroom, joinClassroom, getStudentClassrooms } = require("../controllers/classroomControllers");

const router = express.Router();

// router.get("/", (req, res) => { res.send("Classroom") });
router.post("/create", createClassroom);
router.post("/join", joinClassroom);
router.get("/", getStudentClassrooms);

module.exports = router;
