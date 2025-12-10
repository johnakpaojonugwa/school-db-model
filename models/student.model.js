import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    student_avatar: String,
    password: { type: String, minlength: 6, required: true, trim: true },
    role: { type: String, enum: ['student', 'prefect'], default: 'student' },
    isLoggedIn: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    dob: { type: Date, default: Date.now },
    lastLoggedIn: { type: Date, default: Date.now },
    subjects: [{ type: String }]
}, { timestamps: true });

//Hashing the password
    studentSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcryptjs.hash(this.password, 10);
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
}

const Student = mongoose.model("Student", studentSchema);

export default Student;