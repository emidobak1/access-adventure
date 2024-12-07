// src/utils/authService.js
const API_URL = 'http://localhost:5000/api';

export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    return null;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    return null;
  }
};

export const updateUserRole = async (username, newRole) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newRole })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    return null;
  }
};

export const deleteUser = async (username) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to delete user');
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    return false;
  }
};