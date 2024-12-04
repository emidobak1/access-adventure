// src/utils/authService.js
import * as jose from 'jose';

const secret = new TextEncoder().encode('your-secret-key');

export const generateToken = async (payload) => {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
  return token;
};

export const verifyToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
};

export const registerUser = async (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[username]) {
    return null;
  }

  const newUser = {
    password, // In a real app, you'd hash this
    role: 'Explorer',
    challenges: {
      navigator: false,
      master: false
    }
  };

  users[username] = newUser;
  localStorage.setItem('users', JSON.stringify(users));

  const token = await generateToken({ username, role: 'Explorer' });
  return { token, user: { ...newUser, username } };
};

export const loginUser = async (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[username];
  
  if (!user || user.password !== password) {
    return null;
  }

  const token = await generateToken({ username, role: user.role });
  return { token, user: { ...user, username } };
};

export const updateUserRole = async (username, newRole) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[username]) {
    users[username].role = newRole;
    localStorage.setItem('users', JSON.stringify(users));
    
    const token = await generateToken({ username, role: newRole });
    return { token, user: { ...users[username], username } };
  }
  return null;
};

export const completeChallenge = (username, challengeType) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[username]) {
    users[username].challenges[challengeType] = true;
    localStorage.setItem('users', JSON.stringify(users));
    return { user: { ...users[username], username } };
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