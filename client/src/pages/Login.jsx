import React,{ useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      if (res.data?.user?.role) {
        localStorage.setItem('role', res.data.user.role);
      }
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      setMsg("Login successful! Welcome " + res.data.user.name);
      const role = res.data?.user?.role;
      if (role === 'instructor') navigate('/instructor');
      else navigate('/student');
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">New here?</span>
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create account</Link>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Sign in</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Access your learning dashboard</p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <button type="button" onClick={() => setShowPassword(v=>!v)} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">{showPassword? 'Hide' : 'Show'}</button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" type={showPassword? 'text':'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md" type="submit">Sign in</button>
          </form>
          {msg && <div className="text-sm rounded-lg border-2 border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200 px-4 py-3 font-medium">{msg}</div>}
        </div>
      </div>
      <div className="hidden md:block relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 p-12 flex flex-col items-center justify-center">
          <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl p-8 w-80 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">Your data, your rules</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Secure your learning journey</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-blue-600 rounded-full w-3/4"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-indigo-600 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
