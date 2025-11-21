// src/components/EmployeeList.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import EmployeeForm from './EmployeeForm';
import Modal from './Modal';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [teamIdsInput, setTeamIdsInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);

  const loadEmployees = async () => {
    const data = await api('/employees');
    setEmployees(data);
  };

  useEffect(() => { loadEmployees(); }, []);

  const openAssignModal = (empId) => {
    setSelectedEmpId(empId);
    setTeamIdsInput('');
    setShowAssignModal(true);
  };

  const openDeleteModal = (empId) => {
    setEmpToDelete(empId);
    setShowDeleteModal(true);
  };

  // const handleAssignTeams = async () => {
  //   const teamIds = teamIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  //   if (teamIds.length === 0) return;
  //   await api(`/employees/${selectedEmpId}/teams`, {
  //     method: 'POST',
  //     body: JSON.stringify({ teamIds })
  //   });
  //   setShowAssignModal(false);
  //   loadEmployees();
  // };

  const handleAssignTeams = async () => {
    const teamIds = teamIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (teamIds.length === 0) return;

    try {
      const response = await api(`/employees/${selectedEmpId}/teams`, {
        method: 'POST',
        body: JSON.stringify({ teamIds })
      });

      // UPDATE THE SPECIFIC EMPLOYEE IN STATE
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmpId 
          ? { ...emp, teamNames: response.employee.teamNames }
          : emp
      ));

      setShowAssignModal(false);
    } catch (err) {
      alert('Failed to assign teams');
    }
  };

  const handleDelete = async () => {
    await api(`/employees/${empToDelete}`, { method: 'DELETE' });
    setShowDeleteModal(false);
    loadEmployees();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          + Add Employee
        </button>
      </div>

      {showForm && <EmployeeForm onClose={() => { setShowForm(false); loadEmployees(); }} />}

      <div className="space-y-4">
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No employees yet</p>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{emp.name}</h3>
                  <p className="text-gray-600">{emp.position} • {emp.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Teams: {emp.teamNames?.join(', ') || 'None'}
                  </p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => openAssignModal(emp.id)} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">
                    Assign Teams
                  </button>
                  <button onClick={() => openDeleteModal(emp.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Teams Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Employee to Teams">
        <p className="text-gray-700 mb-4">Enter team IDs (comma-separated):</p>
        <input
          type="text"
          placeholder="1, 3, 5"
          className="w-full px-4 py-2 border rounded-lg mb-6"
          value={teamIdsInput}
          onChange={(e) => setTeamIdsInput(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={handleAssignTeams} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Assign
          </button>
          <button onClick={() => setShowAssignModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Employee">
        <p className="text-gray-700 mb-6">Are you sure you want to delete this employee? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Yes, Delete
          </button>
          <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}