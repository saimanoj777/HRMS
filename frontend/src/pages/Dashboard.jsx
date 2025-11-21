import Navbar from '../components/Navbar';
import EmployeeList from '../components/EmployeeList';
import TeamList from '../components/TeamList';
import ActivityLog from '../components/ActivityLog';

export default function Dashboard({ token, setToken }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setToken={setToken} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EmployeeList />
          </div>
          <div className="space-y-8">
            <TeamList />
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}