const express = require("express");
const { loginStudent, signupStudent } = require("../controllers/studentControllers");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", (req, res) => { res.send("Student") });
router.post("/signup", upload.single("image"), signupStudent);
router.post("/login", loginStudent);

module.exports = router;
