const API_URL = process.env.REACT_APP_API_URL || 'https://access-adventure-backend.vercel.app/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong');
  }
  return response.json();
};

export const registerUser = async (username, password) => {
  try {
    console.log('Attempting to register with:', { username }); // Debug log
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password}),
    });

    console.log('Registration response status:', response.status); // Debug log
    
    const data = await response.json();
    console.log('Registration response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error details:', error);
    return null;
  }
};

export const loginUser = async (username, password) => {
  try {
    console.log('Attempting to login user:', username); // Debug log

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status); // Debug log

    const data = await response.json();
    console.log('Login response data:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token if login successful
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error details:', error);
    return null;
  }
};


export const verifyToken = async (token) => {
  try {
    console.log('Verifying token...');
    const response = await fetch(`${API_URL}/game/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Verify response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    console.log('Verify response data:', data);
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export const updateUserRole = async (token, newRole) => {
  try {
    const response = await fetch(`${API_URL}/game/user/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newRole }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Role update error:', error);
    return null;
  }
};

export const deleteUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
};

export const logoutUser = async (token) => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const fetchRoleContent = async (token, role) => {
  try {
    console.log('Fetching content for role:', role);
    const response = await fetch(`${API_URL}/game/${role.toLowerCase()}-content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Content fetch error:', data);
      throw new Error(data.error || 'Failed to fetch content');
    }

    return data;
  } catch (error) {
    console.error('Content fetch error:', error);
    return null;
  }
};