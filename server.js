import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';


dotenv.config();

const app = express();
app.use(express.json());

connectDB();

//Routes
app.use('/api/v1/teachers', teacherRoutes); //http://localhost:4777/api/v1/teachers/register
// student routes
app.use('/api/v1/students', studentRoutes);
// course routes
app.use('/api/v1/courses', courseRoutes);
const PORT = process.env.PORT_NO || 4777;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
})