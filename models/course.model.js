import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true },
    description: { type: String, required: true, trim: true },
    backCover: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;