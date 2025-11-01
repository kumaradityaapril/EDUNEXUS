import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  fileUrl: String, // (optional: assignment document)
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answer: String,
    fileUrl: String, // (optional: submitted file)
    submittedAt: Date
  }]
});

export default mongoose.model('Assignment', assignmentSchema);
