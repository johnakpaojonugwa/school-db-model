import Course from '../models/course.model.js';

//Create a new course
export const createCourse = async (req, res) => {
    const { title, description, courseCode, backCover } = req.body;

    if (!title || !description || !courseCode) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields must be provided.' 
        });
    }

    try {
        const existingCourse = await Course.findOne({ courseCode });

        if (existingCourse) {
            return res.status(409).json({ 
                success: false, 
                message: 'Course with this code already exists.' 
            });
        }

        const newCourse = new Course({ title, description, courseCode, backCover });
        await newCourse.save();

        return res.status(201).json({ 
            success: true, 
            message: 'Course created successfully', 
            data: newCourse 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
}


// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'No courses found.' });
        }
        res.status(200).json({ success: true, total: courses.length, message: 'Courses retrieved successfully.', data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Get a single course by ID
export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.status(200).json({ success: true, message: 'Coruse retrieved successfully.', data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Update course
export const updateCourse = async (req, res) => {
    const { courseId } = res.params;
    const { courseCode, title, ...otherupdates } = res.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (courseCode && courseCode !== course.courseCode) {
            const existingCourse = await Course.findOne({ courseCode });
            if (existingCourse) {
                return res.status(409).json({ success: false, message: 'Course with this code already exists.' });
            }
        }
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { courseCode, title, ...otherupdates }, { new: true } );
        res.status(200).json({ success: true, message: 'Course updated successfully.', data: updatedCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Delete course
export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.'});
        }
        res.status(200).json({ success: true, message: 'Course deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Sevrer error', error: error.message });
    }
}


