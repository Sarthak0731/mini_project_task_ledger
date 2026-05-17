import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './Chat';
import Notifications from './Notifications';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskledger_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskledger_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskledger_user');
    localStorage.removeItem('taskledger_token');
    navigate('/login');
  };

  return (
    <div className="app-root" style={{minHeight:'100vh', background:'#0d1117'}}>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/notifications" element={<Notifications user={user} />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
