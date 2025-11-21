// src/components/Navbar.jsx
export default function Navbar({ setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}