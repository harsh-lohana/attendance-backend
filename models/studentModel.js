const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        studentID: {
            type: String,
            required: true,
            unique: true,
        },
        branch: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
