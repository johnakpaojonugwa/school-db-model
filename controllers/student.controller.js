import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";

// Create student
export const addStudent = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const student = await Student.findOne({ email });
        const avatar = req.files?.avatar?.[0]?.path || null;

        if (student) {
            return res.status(400).json({ success: false, message: "student already exists." });
        }
        const newStudent = new Student({ firstName, lastName, email, password, student_avatar: avatar });
        await newStudent.save();
        res.status(201).json({ success: true, message: "Student registered successfully.", data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering student.", error: error.message });
    }
}

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const student = await Student.find();
        if (student.length === 0) return res.status(404).json({ success: false, message: "No student found." });
        res.status(200).json({ success: true, total: student.length, message: "Students fetched successfully.", data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching students.", error: error.message });
    }
}

// Get single student
export const getSingleStudent = async (req, res) => {
    const { studentId } = req.params
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "No student found" })
        }
        res.status(200).json({ success: true, data: student })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching student", error: error.message })
    }
}

//Update student details
export const updateStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const updateData = { ...req.body };
        const avatar = req.files?.student_avatar?.[0]?.path;
        if (avatar) {
            updateData.student_avatar = avatar;
        }
        const student = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
        if (!student) {
            return res.status(404).json({ success: false, message: "No student found" });
        }
        res.status(200).json({ success: true, message: "Student updated successfully", data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating student", error: error.message });
    }
}

// Student login
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, { expiresIn: '2d' });

        student.isLoggedIn = true;
        student.isOnline = true;
        student.lastLoggedIn = Date.now();
        await student.save();

        res.status(200).json({ success: true, message: "Login successful.", data: { student, token } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in.", error: error.message });
    }
}

// Student logout
export const logoutStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "No student found." });
        }
        student.isLoggedIn = false;
        student.isOnline = false;
        await student.save();
        res.status(200).json({ success: true, message: "Logout successful." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging out.", error: error.message });
    }
}

// Delete student
export const deleteStudent = async (req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
        return res.status(400).json({ success: false, message: "Student ID is required." });
    }
    try {
        const student = await Student.findByIdAndDelete(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }
        res.status(200).json({ success: true, message: "Student deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting student.", error: error.message });
    }
}