import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllAssignments() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });

      const enrolled = res.data.filter((course) => course.students.includes(user.id));
      setEnrolledCourses(enrolled);

      // Fetch assignments for each enrolled course
      const assignmentsMap = {};
      for (const course of enrolled) {
        try {
          const assignmentRes = await axios.get(`http://localhost:5000/api/assignments/${course._id}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          });
          assignmentsMap[course._id] = assignmentRes.data;
        } catch (err) {
          console.error(`Error fetching assignments for course ${course._id}:`, err);
          assignmentsMap[course._id] = [];
        }
      }
      setAssignmentsByCourse(assignmentsMap);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setMessage('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { text: 'No deadline', color: 'text-gray-500' };
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 font-semibold' };
    if (diffDays <= 3) return { text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, color: 'text-orange-600 font-semibold' };
    return { text: `Due in ${diffDays} days`, color: 'text-gray-600' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  const totalAssignments = Object.values(assignmentsByCourse).flat().length;

  if (enrolledCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enrolled Courses</h3>
        <p className="text-gray-500 mb-4">You need to enroll in courses to see assignments.</p>
        <Link to="/student" className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          View Courses
        </Link>
      </div>
    );
  }

  if (totalAssignments === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Available</h3>
        <p className="text-gray-500">Your enrolled courses don't have any assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
          <p className="text-sm text-gray-600 mt-1">
            {totalAssignments} assignment{totalAssignments !== 1 ? 's' : ''} from {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700">
          {message}
        </div>
      )}

      {enrolledCourses.map((course) => {
        const assignments = assignmentsByCourse[course._id] || [];
        if (assignments.length === 0) return null;

        return (
          <section key={course._id} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  Instructor: {course.instructor?.name || '—'}
                </p>
              </div>
              <Link
                to={`/student-assignments/${course._id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((assignment) => {
                const deadlineStatus = getDeadlineStatus(assignment.deadline);
                return (
                  <div
                    key={assignment._id}
                    className="rounded-lg border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900 flex-1">{assignment.title}</h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {assignment.description || 'No description provided.'}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Deadline:</span>
                        <span className={deadlineStatus.color}>
                          {formatDate(assignment.deadline)}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={deadlineStatus.color}>{deadlineStatus.text}</span>
                      </div>
                      {assignment.submissions && assignment.submissions.length > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Submitted
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/student-assignments/${course._id}`}
                      className="block w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      {assignment.submissions && assignment.submissions.length > 0 ? 'View Submission' : 'Submit Assignment'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

