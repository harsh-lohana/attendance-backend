const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const generateImageID = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const signupStudent = asyncHandler(async (req, res) => {

  const { name, email, password, studentID, branch, year } = req.body;
  const image = req.file;
  const imageID = generateImageID();

  const putObjectParams = {
    Bucket: bucketName,
    Key: imageID,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }
  const putCommand = new PutObjectCommand(putObjectParams);
  await s3Client.send(putCommand);

  const studentExists = await Student.findOne({ studentID });

  if (studentExists) {
    res.status(404);
    throw new Error("Student already exists!");
  }

  const getObjectParams = {
    Bucket: bucketName,
    Key: imageID
  }
  const getCommand = new GetObjectCommand(getObjectParams);
  const imageURL = await getSignedUrl(s3Client, getCommand);
  console.log(imageURL)

  const student = await Student.create({ name, email, password, studentID, branch, year, image: imageURL });

  if (student) {
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      studentID: student.studentID,
      branch: student.branch,
      year: student.year,
      image: student.image,
      token: generateToken(student._id),
    });
  } else {
    res.status(400);
    throw new Error("Student not found!");
  }
});

const loginStudent = asyncHandler(async (req, res) => {
  const { studentID, password } = req.body;

  const student = await Student.findOne({ studentID });

  if (student && (await student.matchPassword(password))) {
    res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      studentID: student.studentID,
      branch: student.branch,
      year: student.year,
      image: student.image,
      token: generateToken(student._id),
    })
  } else {
    res.status(401);
    throw new Error("Invalid email or password!");
  }
})

module.exports = { signupStudent, loginStudent };