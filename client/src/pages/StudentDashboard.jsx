
import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all courses
    axios
      .get(`${import.meta.env.VITE_API_URL}/courses`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then((res) => setCourses(res.data));

    // Optionally, fetch enrolled courses if you have such an endpoint.
    // For now, filter locally
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/courses`, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then((res) => {
          const enrolled = res.data.filter((course) =>
            course.students.includes(user.id)
          );
          setEnrolledCourses(enrolled);
        });
    }
  }, []);

  const enroll = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/enroll/${id}`,
        {},
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      );
      setMessage('Enrolled! Refresh to see updated courses.');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold mb-3">Available Courses</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((c) => (
            <li key={c._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Instructor: {c.instructor?.name || '—'}</div>
              <button className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={() => enroll(c._id)}>
                Enroll
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold mb-3">My Enrolled Courses</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {enrolledCourses.map((course) => (
            <li key={course._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="font-medium">{course.title}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm" to={`/courses/${course._id}/lectures`}>View Lectures</Link>
                <Link className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm" to={`/student-assignments/${course._id}`}>View Assignments</Link>
              </div>
            </li>
          ))}
        </ul>
        {message && <div className="text-sm mt-3 text-green-600 dark:text-green-400">{message}</div>}
      </section>
    </div>
  );
}
