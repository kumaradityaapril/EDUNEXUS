import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CourseLectures() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [durations, setDurations] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}` , {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        setCourse(res.data);
      } catch (e) {
        setError(e.response?.data?.msg || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!course) return null;

  const lectures = course.lectures || [];

  const storageKey = (idx) => `progress:${courseId}:${idx}`;

  const onLoadedMetadata = (idx, e) => {
    const d = Math.floor(e.target.duration || 0);
    setDurations(prev => ({ ...prev, [idx]: d }));
    const saved = JSON.parse(localStorage.getItem(storageKey(idx)) || 'null');
    if (saved && saved.time && saved.time < e.target.duration) {
      e.target.currentTime = saved.time;
      setProgress(prev => ({ ...prev, [idx]: Math.round((saved.time / e.target.duration) * 100) }));
    }
  };

  const onTimeUpdate = (idx, e) => {
    const t = e.target.currentTime;
    const d = e.target.duration || 0;
    const pct = d ? Math.round((t / d) * 100) : 0;
    setProgress(prev => ({ ...prev, [idx]: pct }));
    localStorage.setItem(storageKey(idx), JSON.stringify({ time: t }));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">{course.title} — Lectures</h2>
      {lectures.length === 0 && (
        <div className="text-sm text-gray-500">No video lectures uploaded yet.</div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {lectures.map((lec, idx) => {
          const url = typeof lec === 'string' ? lec : lec.url;
          const title = typeof lec === 'string' ? `Lecture ${idx+1}` : (lec.title || `Lecture ${idx+1}`);
          const duration = durations[idx];
          const pct = progress[idx] || 0;
          return (
            <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <div className="font-medium truncate">{title}</div>
                <div className="text-xs text-gray-500">{duration ? `${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')}` : ''}</div>
              </div>
              <video src={url} controls className="w-full" onLoadedMetadata={(e)=>onLoadedMetadata(idx, e)} onTimeUpdate={(e)=>onTimeUpdate(idx, e)} />
              <div className="h-1 bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-blue-600" style={{ width: pct + '%' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


