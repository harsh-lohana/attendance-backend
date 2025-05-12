const express = require("express");
const { createAttendance, getClassroomAttendance } = require("../controllers/attendanceControllers");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", (req, res) => { res.send("Attendance") });
router.post("/create", upload.single("video"), createAttendance);
router.get("/classroom", getClassroomAttendance);

module.exports = router;
