// src/components/TeamList.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import TeamForm from './TeamForm';
import Modal from './Modal';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const loadTeams = async () => {
    const data = await api('/teams');
    setTeams(data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const openDeleteModal = (team) => {
    setTeamToDelete(team);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;
    await api(`/teams/${teamToDelete.id}`, { method: 'DELETE' });
    setShowDeleteModal(false);
    setTeamToDelete(null);
    loadTeams();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Team
        </button>
      </div>

      {/* Add Team Form Modal */}
      {showForm && <TeamForm onClose={() => { setShowForm(false); loadTeams(); }} />}

      <div className="space-y-4">
        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No teams created yet</p>
        ) : (
          teams.map(team => (
            <div
              key={team.id}
              className="border rounded-lg p-5 hover:shadow-md transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
                {team.description && (
                  <p className="text-gray-600 text-sm mt-1">{team.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Members: {team.members?.length > 0 ? team.members.join(', ') : 'No members yet'}
                </p>
                <span className="inline-block mt-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  ID: {team.id}
                </span>
              </div>

              <button
                onClick={() => openDeleteModal(team)}
                className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Team"
      >
        {teamToDelete && (
          <>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the team
              <strong className="mx-1">"{teamToDelete.name}"</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              All employee assignments to this team will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium"
              >
                Yes, Delete Team
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 py-2.5 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}