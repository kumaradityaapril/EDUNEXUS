import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const useCloudinary = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);

let upload;
if (useCloudinary) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'EduNexus/assignments',
      resource_type: 'auto'
    }
  });
  upload = multer({ storage });
} else {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'assignments');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `submission-${unique}${ext}`);
    }
  });
  upload = multer({ storage });
}

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

// Instructor: create assignment
router.post('/:courseId', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ msg: 'Only instructors' });
  const { title, description, deadline } = req.body;
  const assignment = new Assignment({
    course: req.params.courseId,
    title,
    description,
    deadline
  });
  await assignment.save();
  res.json({ msg: 'Assignment created', assignment });
});

// Get assignments for a course (anyone)
router.get('/:courseId', auth, async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId });
  res.json(assignments);
});

// Student: submit solution
router.post('/submit/:assignmentId', auth, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ msg: 'Only students' });
    const { answer } = req.body;
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    let fileUrl = null;
    if (req.file) {
      if (useCloudinary) {
        fileUrl = req.file.path;
      } else {
        fileUrl = `/uploads/assignments/${req.file.filename}`;
      }
    }

    assignment.submissions.push({
      student: req.user.id,
      answer: answer || '',
      fileUrl,
      submittedAt: new Date()
    });
    await assignment.save();
    res.json({ msg: 'Submitted!', assignment });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ msg: 'Failed to submit assignment' });
  }
});

// Instructor: view submissions for a specific assignment
router.get('/submissions/:assignmentId', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ msg: 'Only instructors' });
  const assignment = await Assignment.findById(req.params.assignmentId)
    .populate('submissions.student', 'name email role')
    .populate('course', 'title');
  if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });
  res.json(assignment);
});

// Instructor: get all assignments with submissions for their courses
router.get('/instructor/submissions', auth, async (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).json({ msg: 'Only instructors' });
  try {
    // Get all courses created by the instructor
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = courses.map(c => c._id);
    
    // Get all assignments for these courses with submissions
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .populate('submissions.student', 'name email role')
      .lean();
    
    // Filter to only show assignments with submissions
    const assignmentsWithSubmissions = assignments.filter(a => a.submissions && a.submissions.length > 0);
    
    res.json(assignmentsWithSubmissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ msg: 'Failed to fetch submissions' });
  }
});

export default router;
