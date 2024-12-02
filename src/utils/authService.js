// src/utils/authService.js
export const registerUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
      console.log('Registration failed: User already exists');
      return null;
    }
  
    const newUser = {
      password,
      role: 'Explorer',
      challenges: {
        knight: false,
        scholar: false
      }
    };
  
    users[username] = newUser;
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Registration successful:', { username, role: newUser.role });
    return newUser;
  };
  
  export const loginUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    console.log('Attempting login for:', username);
    console.log('Stored users:', users);
    
    if (!users[username]) {
      console.log('Login failed: User not found');
      return null;
    }
    
    if (users[username].password !== password) {
      console.log('Login failed: Invalid password');
      return null;
    }
  
    console.log('Login successful:', { username, role: users[username].role });
    return users[username];
  };
  
  export const getCurrentUser = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username] || null;
  };
  
  export const updateUserRole = (username, role) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
      users[username].role = role;
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Role updated:', { username, newRole: role });
      return users[username];
    }
    return null;
  };
  
  export const completeChallenge = (username, challengeType) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
      users[username].challenges[challengeType] = true;
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Challenge completed:', { username, challengeType });
      return users[username];
    }
    return null;
  };

  export const deleteUser = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
      delete users[username];
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  };