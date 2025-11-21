import { useState, useEffect } from 'react';
import api from '../services/api';
import TeamForm from './TeamForm';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadTeams = async () => {
    const data = await api('/teams');
    setTeams(data);
  };

  useEffect(() => { loadTeams(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this team?')) return;
    await api(`/teams/${id}`, { method: 'DELETE' });
    loadTeams();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
          + Add Team
        </button>
      </div>

      {showForm && <TeamForm onClose={() => { setShowForm(false); loadTeams(); }} />}

      <div className="space-y-4">
        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No teams yet</p>
        ) : (
          teams.map(team => (
            <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{team.name}</h3>
                  {team.description && <p className="text-gray-600 text-sm">{team.description}</p>}
                  <p className="text-sm text-gray-500 mt-2">
                    Members: {team.members?.length > 0 ? team.members.join(', ') : 'None'}
                  </p>
                </div>
                <button onClick={() => handleDelete(team.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}