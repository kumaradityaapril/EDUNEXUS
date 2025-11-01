import express from 'express';
import Course from '../models/Course.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT and extract user
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Instructor: Create Course
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ msg: 'Only instructors can create courses' });
  const { title, description } = req.body;
  const course = new Course({ title, description, instructor: req.user.id });
  await course.save();
  res.json({ msg: 'Course created', course });
});

// Instructor: Get My Courses
router.get('/instructor', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ msg: 'Only instructors' });
  const courses = await Course.find({ instructor: req.user.id });
  res.json(courses);
});

// Student: View All Courses
router.get('/', auth, async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name');
  res.json(courses);
});

// Student: Enroll in Course
router.post('/enroll/:id', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Only students can enroll' });
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ msg: "Course not found" });
  if (course.students.includes(req.user.id)) return res.status(400).json({ msg: 'Already enrolled' });
  course.students.push(req.user.id);
  await course.save();
  res.json({ msg: 'Enrolled!', course });
});

// Get a single course by id (includes lectures)
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    return res.json(course);
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to load course' });
  }
});

export default router;
