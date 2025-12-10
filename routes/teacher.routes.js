import express from 'express';
import { register, getAllTeachers, getSingleTeacher, loginTeacher, updateTeacher, logoutTeacher, deleteTeacher } from '../controllers/teacher.controller.js';
import uploadMiddleware from '../utils/upload.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to register a new teacher
router.post('/register', protect, authorize('admin'), uploadMiddleware, register);
// Route to get all teachers
router.get('/', getAllTeachers);
//Route to login teacher
router.post('/login', loginTeacher);
//Route to get single teacher
router.get('/:teacherId', getSingleTeacher);
//Route to update teacher details
router.put('/:teacherId', protect, uploadMiddleware, updateTeacher);
//route to logout teacher
router.post('/logout/:teacherId', logoutTeacher);
//route to delete teacher
router.delete('/:teacherId', protect, authorize('admin'), deleteTeacher);

export default router;  