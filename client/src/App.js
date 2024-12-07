// src/App.js
import React, { useState, useEffect } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import GameInterface from './components/GameInterface';
import { loginUser, registerUser, verifyToken } from './utils/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          setCurrentUser(payload.username);
          setUserRole(payload.role);
        } else {
          handleLogout();
        }
      }
    };
    checkToken();
  }, [token]);

  const handleRegister = async (username, password) => {
    const result = await registerUser(username, password);
    if (result) {
      setCurrentUser(username);
      setUserRole(result.user.role);
      setToken(result.token);
      localStorage.setItem('token', result.token);
      return true;
    }
    return false;
  };

  const handleLogin = async (username, password) => {
    const result = await loginUser(username, password);
    if (result) {
      setCurrentUser(username);
      setUserRole(result.user.role);
      setToken(result.token);
      localStorage.setItem('token', result.token);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
  };

  if (currentUser) {
    return (
      <GameInterface 
        username={currentUser} 
        role={userRole} 
        onLogout={handleLogout}
        onRoleChange={handleRoleChange}
      />
    );
  }

  return isRegistering ? (
    <Registration 
      onRegister={handleRegister}
      onSwitchToLogin={() => setIsRegistering(false)}
    />
  ) : (
    <Login 
      onLogin={handleLogin}
      onSwitchToRegister={() => setIsRegistering(true)}
    />
  );
}

export default App;