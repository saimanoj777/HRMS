import { useState } from 'react';
import api from '../services/api';

export default function TeamForm({ onClose }) {
  const [form, setForm] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api('/teams', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h3 className="text-xl font-bold mb-6">Create New Team</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Team Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            rows="3"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Create Team
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