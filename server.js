import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';


dotenv.config();

const app = express();
app.use(express.json());

// const allowedOrigin = [process.env.CORSORIGIN];
// app.use(cors({
//     origin: allowedOrigin,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }))

app.use(cors())

connectDB();

//Routes
app.use('/api/v1/teachers', teacherRoutes); 
// student routes
app.use('/api/v1/students', studentRoutes);
// course routes
app.use('/api/v1/courses', courseRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
})