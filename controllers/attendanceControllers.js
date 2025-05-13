const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Classroom = require("../models/classroomModel");
const Attendance = require("../models/attendanceModel");
const asyncHandler = require("express-async-handler");
const generateID = require("../utils/generateID");
const dotenv = require("dotenv");
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

const createAttendance = asyncHandler(async (req, res) => {
    const { classroomID } = req.body;
    const video = req.file;

    const videoID = generateID();

    const putObjectParams = {
        Bucket: bucketName,
        Key: videoID,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const putCommand = new PutObjectCommand(putObjectParams);
    await s3Client.send(putCommand);

    const getObjectParams = {
        Bucket: bucketName,
        Key: videoID
    }
    const getCommand = new GetObjectCommand(getObjectParams);
    const videoURL = await getSignedUrl(s3Client, getCommand, {expiresIn: 129600});

    const attendance = await Attendance.create({ classroom: classroomID, video: videoURL });

    if (attendance) {
        res.status(201).json({
            _id: attendance._id,
            classroom: attendance.classroom,
            students: attendance.students,
            video: attendance.video,
        });
    } else {
        res.status(400);
        throw new Error("Attendance not found!");
    }

});

const getClassroomAttendance = asyncHandler(async (req, res) => {
    const { classroomID } = req.query;

    const attendance = await Attendance.find({ classroom: classroomID }).populate("students");
    if (attendance) {
        res.status(200).json(attendance);
    } else {
        res.status(400);
        throw new Error("Attendance not found!");
    }
});

const getStudentClassroomAttendance = asyncHandler(async (req, res) => {
    const { studentID, classroomID } = req.query;

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

    const total = await Attendance.find({ classroom: classroomID });
    if (total) {
        const present = total.filter(a => a.students.includes(studentID));
        res.status(200).json({ total, present });
    }
    else {
        res.status(400);
        throw new Error("Attendance not found!");
    }

})

module.exports = { createAttendance, getClassroomAttendance, getStudentClassroomAttendance }