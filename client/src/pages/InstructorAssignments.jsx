import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InstructorAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/courses/instructor`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    }).then(res => setCourses(res.data));
  }, []);

  const loadAssignments = courseId => {
    setSelectedCourse(courseId);
    axios.get(`${import.meta.env.VITE_API_URL}/assignments/${courseId}`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    }).then(res => setAssignments(res.data));
  };

  const createAssignment = async e => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/assignments/${selectedCourse}`, form, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    setMessage('Assignment created');
    loadAssignments(selectedCourse);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold mb-3">Create Assignment</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <select className="px-3 py-2 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none" value={selectedCourse} onChange={e => loadAssignments(e.target.value)}>
            <option value="" className="text-gray-900 dark:text-white">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id} className="text-gray-900 dark:text-white">{c.title}</option>)}
          </select>
          {selectedCourse && (
            <>
              <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-3">
                <input className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                <button className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" type="submit" onClick={createAssignment}>Create</button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 className="font-semibold mb-3">Assignments</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {assignments.map(a => (
            <li key={a._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Deadline: {a.deadline?.slice(0,10) || '—'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{a.description}</div>
            </li>
          ))}
        </ul>
        {message && <div className="text-sm mt-3 text-green-600 dark:text-green-400">{message}</div>}
      </section>
    </div>
  );
}
