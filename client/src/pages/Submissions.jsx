import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Submissions() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/assignments/instructor/submissions', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
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
        <div className="text-gray-500">Loading submissions...</div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Yet</h3>
        <p className="text-gray-500">Students haven't submitted any assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Submitted Assignments</h2>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-6">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">Course: {assignment.course?.title || 'Unknown'}</span>
                    {assignment.deadline && (
                      <span>Deadline: {formatDate(assignment.deadline)}</span>
                    )}
                  </div>
                  {assignment.description && (
                    <p className="mt-2 text-gray-600">{assignment.description}</p>
                  )}
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  {assignment.submissions?.length || 0} {assignment.submissions?.length === 1 ? 'Submission' : 'Submissions'}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {assignment.submissions?.map((submission, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                          {submission.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {submission.student?.name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-600">{submission.student?.email || 'No email'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted: {formatDate(submission.submittedAt)}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {submission.answer && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Answer:</label>
                          <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 whitespace-pre-wrap">
                            {submission.answer}
                          </div>
                        </div>
                      )}

                      {submission.fileUrl && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Submitted File:</label>
                          <a
                            href={submission.fileUrl.startsWith('http') ? submission.fileUrl : `http://localhost:5000${submission.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>View/Download File</span>
                          </a>
                        </div>
                      )}

                      {!submission.answer && !submission.fileUrl && (
                        <div className="text-sm text-gray-500 italic">No submission content provided</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

