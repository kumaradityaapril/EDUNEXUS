import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Allow both legacy string URLs and new object shape with metadata
  lectures: [{
    url: { type: String, required: false },
    title: { type: String },
    thumbnail: { type: String },
    duration: { type: Number }
  }]
});

export default mongoose.model('Course', courseSchema);
