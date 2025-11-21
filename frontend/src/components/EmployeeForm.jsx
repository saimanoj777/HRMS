import { useState } from 'react';
import api from '../services/api';

export default function EmployeeForm({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', position: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api('/employees', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h3 className="text-xl font-bold mb-6">Add New Employee</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Position"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Create Employee
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}