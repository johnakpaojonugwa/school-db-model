import express from 'express';
import { addStudent, deleteStudent, getAllStudents, getSingleStudent, loginStudent, logoutStudent, updateStudent } from '../controllers/student.controller.js';
import uploadMiddleware from '../utils/upload.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to register a new student
router.post('/add', protect, authorize('admin'), uploadMiddleware, addStudent);
// Route to get all students
router.get('/', getAllStudents);
//Route to get single student
router.get('/:studentId', getSingleStudent);
//Route to login student
router.post('/login', loginStudent);
//Route to update student details
router.put('/:studentId', protect, authorize('admin'), uploadMiddleware, updateStudent);
//route to logout student
router.post('/logout/:studentId', logoutStudent);
//route to delete student
router.delete('/:studentId', protect, authorize('admin'), deleteStudent);

export default router;  