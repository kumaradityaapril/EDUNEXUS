import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleLanding() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'instructor') navigate('/instructor', { replace: true });
    else navigate('/student', { replace: true });
  }, [navigate]);
  return null;
}


