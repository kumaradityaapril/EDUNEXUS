import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Course from '../models/Course.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const useCloudinary = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);

let upload;
if (useCloudinary) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'EduNexus',
      resource_type: 'video'
    }
  });
  upload = multer({ storage });
} else {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'videos');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${unique}${ext}`);
    }
  });
  upload = multer({ storage });
}

router.post('/:courseId', upload.single('video'), async (req, res) => {
  try {
    const { courseId } = req.params;

    let videoUrl = req.body?.url; // allow direct URL payload as alternative
    if (!videoUrl) {
      if (!req.file) {
        return res.status(400).json({ msg: 'No video provided' });
      }
      if (useCloudinary) {
        // multer-storage-cloudinary sets path to the hosted URL
        videoUrl = req.file.path;
      } else {
        // Serve via /uploads static path
        const fileRel = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
        videoUrl = `${req.protocol}://${req.get('host')}/${fileRel}`;
      }
    }

    const lectureObj = { url: videoUrl };
    if (req.body?.title) lectureObj.title = req.body.title;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { lectures: lectureObj } },
      { new: true }
    );
    return res.json(course);
  } catch (err) {
    console.error('Video upload error:', err);
    return res.status(500).json({ msg: 'Video upload failed' });
  }
});

// Rename a lecture by index
router.patch('/:courseId/:index', async (req, res) => {
  try {
    const { courseId, index } = req.params;
    const { title } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    const i = parseInt(index, 10);
    if (Number.isNaN(i) || i < 0 || i >= course.lectures.length) return res.status(400).json({ msg: 'Invalid index' });
    const lec = course.lectures[i];
    if (typeof lec === 'string') {
      course.lectures[i] = { url: lec, title };
    } else {
      course.lectures[i].title = title;
    }
    await course.save();
    return res.json(course);
  } catch (e) {
    return res.status(500).json({ msg: 'Rename failed' });
  }
});

// Delete a lecture by index
router.delete('/:courseId/:index', async (req, res) => {
  try {
    const { courseId, index } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    const i = parseInt(index, 10);
    if (Number.isNaN(i) || i < 0 || i >= course.lectures.length) return res.status(400).json({ msg: 'Invalid index' });
    course.lectures.splice(i, 1);
    await course.save();
    return res.json(course);
  } catch (e) {
    return res.status(500).json({ msg: 'Delete failed' });
  }
});

export default router;
