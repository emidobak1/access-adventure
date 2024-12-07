import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import GameInterface from './components/GameInterface';
import { loginUser, registerUser, verifyToken } from './utils/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const payload = await verifyToken(token);
          if (payload) {
            console.log('Token verification successful:', payload);
            setCurrentUser(payload.username);
            setUserRole(payload.role);
          } else {
            console.log('Token verification failed');
            handleLogout();
          }
        } catch (error) {
          console.error('Token verification error:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };
    checkToken();
  }, [token]);

  const handleLogin = async (username, password) => {
    try {
      const result = await loginUser(username, password);
      console.log('Login result:', result);

      if (result && result.token) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setCurrentUser(username);
        setUserRole(result.user.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const result = await registerUser(username, password);
      console.log('Registration result:', result);

      if (result && result.token) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setCurrentUser(username);
        setUserRole(result.user.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setUserRole(null);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add proper loading component
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/game" /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/game" /> : <Login onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/game" /> : <Registration onRegister={handleRegister} />} 
        />
        
        <Route 
          path="/game" 
          element={
            currentUser ? (
              <GameInterface 
                username={currentUser} 
                role={userRole} 
                onLogout={handleLogout}
                onRoleChange={setUserRole}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;