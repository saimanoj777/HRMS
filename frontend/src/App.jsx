import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/*" 
        element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;