import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import videoRoutes from './routes/video.js';
import assignmentRoutes from './routes/assignment.js';
import { initializeSocket } from './socket.js';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// Serve uploaded files when using local storage fallback
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/assignments', assignmentRoutes);


// Routes Placeholder
app.get('/', (req, res) => res.send("EduNexus API running..."));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
const server = createServer(app);
initializeSocket(server);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
