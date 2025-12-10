import Teacher from "../models/teacher.model.js";
import jwt from "jsonwebtoken";

// Create teacher
export const register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const teacher = await Teacher.findOne({ email });
        const avatar = req.files?.avatar?.[0]?.path || null;
        if (teacher) {
            return res.status(400).json({ success: false, message: "teacher already exists." });
        }
        const newTeacher = new Teacher({ firstName, lastName, email, password, role: role, avatar: avatar });
        await newTeacher.save();
        res.status(201).json({ success: true, message: "Teacher registered successfully.", data: newTeacher });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering teacher.", error: error.message });
    }
}

// Get all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teacher = await Teacher.find();
        if (teacher.length === 0) return res.status(404).json({ success: false, message: "No teachers found." });
        res.status(200).json({ success: true, total: teacher.length, message: "Teachers fetched successfully.", data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching teachers.", error: error.message });
    }
}

// Get single teacher
export const getSingleTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "No teacher found" })
        }
        res.status(200).json({ success: true, data: teacher })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching teacher", error: error.message })
    }
}

//Update teacher details
export const updateTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const updateData = { ...req.body };
        const avatar = req.files?.avatar?.[0]?.path;
        if (avatar) {
            updateData.avatar = avatar;
        }
        const teacher = await Teacher.findByIdAndUpdate(teacherId, updateData, { new: true });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "No teacher found" });
        }
        res.status(200).json({ success: true, message: "Teacher updated successfully", data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating teacher", error: error.message });
    }
}

// Teacher login
export const loginTeacher = async (req, res) => {
    const { email, password } = req.body;
    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const isMatch = await teacher.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: teacher._id, role: teacher.role }, process.env.JWT_SECRET, { expiresIn: '2d' });

        teacher.isLoggedIn = true;
        teacher.isOnline = true;
        teacher.lastLoggedIn = Date.now();
        await teacher.save();

        res.status(200).json({ success: true, message: "Login successful.", data: { teacher, token } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in.", error: error.message });
    }
}

// Teacher logout
export const logoutTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "No teacher found." });
        }
        teacher.isLoggedIn = false;
        teacher.isOnline = false;
        await teacher.save();
        res.status(200).json({ success: true, message: "Logout successful." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging out.", error: error.message });
    }
}

//delete teacher
export const deleteTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await Teacher.findByIdAndDelete(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "No teacher found." });
        }
        res.status(200).json({ success: true, message: "Teacher deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting teacher.", error: error.message });
    }
}