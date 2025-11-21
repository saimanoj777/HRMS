import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ orgName: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      alert('Organisation created! Now login.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Organisation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Organisation Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, orgName: e.target.value })}
          />
          <input
            placeholder="Admin Username"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Create Organisation
          </button>
        </form>
      </div>
    </div>
  );
}