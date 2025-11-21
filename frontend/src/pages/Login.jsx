import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          No account? <a href="/register" className="text-blue-600 font-semibold">Register Organisation</a>
        </p>

        {/* TEST CREDENTIALS BOX — ONLY FOR DEMO */}
        <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
            Quick Test Credentials
          </p>
          <div className="space-y-2 text-sm text-amber-900 font-medium">
            <div className="flex justify-between">
              <span className="font-mono bg-amber-100 px-2 py-1 rounded">Username:</span>
              <code className="bg-amber-200 px-3 py-1 rounded font-mono">admin</code>
            </div>
            <div className="flex justify-between">
              <span className="font-mono bg-amber-100 px-2 py-1 rounded">Password:</span>
              <code className="bg-amber-200 px-3 py-1 rounded font-mono">123456</code>
            </div>
          </div>
        </div>
        {/* END TEST CREDENTIALS */}

      </div>
    </div>
  );
}