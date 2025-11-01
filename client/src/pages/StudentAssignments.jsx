import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function StudentAssignments() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch course info
      const courseRes = await axios.get(`${import.meta.env.VITE_API_URL}/courses/${courseId}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setCourse(courseRes.data);

      // Fetch assignments
      const assignmentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/assignments/${courseId}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (assignmentId) => {
    try {
      setMessage('');
      const formData = new FormData();
      formData.append('answer', answers[assignmentId] || '');
      if (files[assignmentId]) {
        formData.append('file', files[assignmentId]);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/assignments/submit/${assignmentId}`, formData, {
        headers: { 
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Assignment submitted successfully!');
      // Clear the form
      setAnswers({ ...answers, [assignmentId]: '' });
      setFiles({ ...files, [assignmentId]: null });
      // Refresh assignments to show submission status
      setTimeout(() => {
        fetchData();
        setMessage('');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to submit. Please try again.');
      console.error('Submission error:', err);
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { text: 'No deadline', color: 'text-gray-500', bg: 'bg-gray-50' };
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
    if (diffDays <= 3) return { text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' };
    return { text: `Due in ${diffDays} days`, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Available</h3>
        <p className="text-gray-500">This course doesn't have any assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {course && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Instructor: {course.instructor?.name || '—'}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Assignments</h3>
        <span className="text-sm text-gray-600">
          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {message && (
        <div className={`p-4 rounded-md border ${
          message.includes('successfully') 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(a => {
          const deadlineStatus = getDeadlineStatus(a.deadline);
          const isSubmitted = a.submissions && a.submissions.length > 0;
          const hasAnswer = answers[a._id]?.trim() || files[a._id];
          
          return (
            <div key={a._id} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">{a.title}</h4>
                {a.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{a.description}</p>
                )}
              </div>

              <div className={`p-3 rounded-md border ${deadlineStatus.bg}`}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">{formatDate(a.deadline)}</span>
                </div>
                <div className={`text-xs font-medium ${deadlineStatus.color}`}>
                  {deadlineStatus.text}
                </div>
              </div>

              {isSubmitted && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span className="font-semibold">✓</span>
                    <span>Already Submitted</span>
                  </div>
                </div>
              )}

              {!isSubmitted && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your answer here..."
                      value={answers[a._id] || ''}
                      onChange={e => setAnswers({ ...answers, [a._id]: e.target.value })}
                      rows="4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File (optional):
                    </label>
                    <input
                      type="file"
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={e => setFiles({ ...files, [a._id]: e.target.files[0] })}
                    />
                    {files[a._id] && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        Selected: {files[a._id].name}
                      </div>
                    )}
                  </div>

                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => submit(a._id)}
                    disabled={!hasAnswer}
                  >
                    Submit Assignment
                  </button>
                </div>
              )}

              {isSubmitted && (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
                    disabled
                  >
                    ✓ Submitted
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
