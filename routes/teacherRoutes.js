const express = require("express");
const { signupTeacher, loginTeacher } = require("../controllers/teacherControllers")

const router = express.Router();

router.route("/").get((req, res) => { res.send("Teacher") });
router.route("/signup").post(signupTeacher);
router.route("/login").post(loginTeacher);

module.exports = router;
