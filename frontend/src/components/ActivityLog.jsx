import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const data = await api('/logs');
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to load logs');
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      <div className="max-h-96 overflow-y-auto font-mono text-sm space-y-1">
        {logs.length === 0 ? (
          <p className="text-gray-500">No activity yet</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}