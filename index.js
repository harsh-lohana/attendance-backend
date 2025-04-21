const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const studentRouter = require("./routes/studentRoutes");
const teacherRouter = require("./routes/teacherRoutes");
const classroomRouter = require("./routes/classroomRoutes");
const attendanceRouter = require("./routes/attendanceRoutes");

const app = express();

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());

app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/attendance", attendanceRouter);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Attendance");
})

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}!`);
})