const Teacher = require("../models/teacherModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

const signupTeacher = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
        res.status(404);
        throw new Error("Teacher already exists!");
    }

    const teacher = await Teacher.create({ name, email, password });

    if (teacher) {
        res.status(201).json({
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            token: generateToken(teacher._id),
        });
    } else {
        res.status(400);
        throw new Error("Teacher not found!");
    }
});

const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const teacher = await Teacher.findOne({ email });
  
    if (teacher && (await teacher.matchPassword(password))) {
      res.status(200).json({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        token: generateToken(teacher._id),
      })
    } else {
      res.status(401);
      throw new Error("Invalid email or password!");
    }
  })

module.exports = { signupTeacher, loginTeacher };