// src/App.js
import React, { useState } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import GameInterface from './components/GameInterface';
import { loginUser, registerUser } from './utils/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleRegister = (username, password) => {
    const user = registerUser(username, password);
    if (user) {
      setCurrentUser(username);
      setUserRole(user.role);
    }
    return user !== null;
  };

  const handleLogin = (username, password) => {
    const user = loginUser(username, password);
    if (user) {
      setCurrentUser(username);
      setUserRole(user.role);
    }
    return user !== null;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
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