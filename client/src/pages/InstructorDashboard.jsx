import React,{ useEffect, useState } from 'react';
import axios from 'axios';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  // Fetch instructor's courses
  useEffect(() => {
    refreshCourses();
  }, []);

  const refreshCourses = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/courses/instructor`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(res => setCourses(res.data));
  };

  // Create new course
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses`,
        form,
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      );
      setCourses([...courses, res.data.course]);
      setForm({ title: '', description: '' });
      setMessage('Course created');
      refreshCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error');
    }
  };

  // Upload a video lecture to a specific course
  const uploadLecture = async (e) => {
    e.preventDefault();
    if (!videoFile || !selectedCourse) return;
    try {
      // Always send file to backend; server uses Cloudinary via multer-storage-cloudinary
      const data = new FormData();
      data.append('video', videoFile);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/videos/${selectedCourse}`,
        data,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMessage('Video uploaded successfully!');
      setVideoFile(null);
      setSelectedCourse('');
      refreshCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Upload error');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold mb-4">Create a Course</h2>
        <form onSubmit={createCourse} className="grid md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" type="submit">Create</button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 className="font-semibold mb-3">My Courses</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map(c => (
            <li key={c._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{c.description}</div>
              {Array.isArray(c.lectures) && c.lectures.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Lectures</div>
                  <ul className="space-y-2">
                    {c.lectures.map((lec, idx) => {
                      const url = typeof lec === 'string' ? lec : lec.url;
                      const title = typeof lec === 'string' ? `Lecture ${idx+1}` : (lec.title || `Lecture ${idx+1}`);
                      return (
                        <li key={idx} className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm">{title}</span>
                          <div className="flex items-center gap-2">
                            <button className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600" onClick={async ()=>{
                              const newTitle = prompt('Rename lecture', title);
                              if (!newTitle) return;
                              await axios.patch(`${import.meta.env.VITE_API_URL}/videos/${c._id}/${idx}`, { title: newTitle });
                              refreshCourses();
                            }}>Rename</button>
                            <button className="text-xs px-2 py-1 rounded-md bg-red-600 text-white" onClick={async ()=>{
                              if (!confirm('Delete this lecture?')) return;
                              await axios.delete(`${import.meta.env.VITE_API_URL}/videos/${c._id}/${idx}`);
                              refreshCourses();
                            }}>Delete</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 className="font-semibold mb-4">Upload Video Lecture</h3>
        <form onSubmit={uploadLecture} className="grid md:grid-cols-3 gap-3">
          <select className="px-3 py-2 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
            <option value="" className="text-gray-900 dark:text-white">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id} className="text-gray-900 dark:text-white">{c.title}</option>)}
          </select>
          <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} required />
          <button className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" type="submit">Upload Lecture</button>
        </form>
        {message && <div className="text-sm mt-3 text-green-600 dark:text-green-400">{message}</div>}
      </section>
    </div>
  );
}
