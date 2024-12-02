// src/components/GameInterface.js
import React, { useState } from 'react';
import { GAME_ROOMS } from '../constants/gameConfig';
import RoleChallenge from './RoleChallenge';
import { updateUserRole, deleteUser } from '../utils/authService';

const GameInterface = ({ username, role, onLogout, onRoleChange }) => {
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [showChallenge, setShowChallenge] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigateToRoom = (roomName) => {
    const targetRoom = GAME_ROOMS[roomName];
    
    if (!targetRoom.requiredRole || targetRoom.requiredRole === role) {
      setCurrentRoom(roomName);
      setMessage('');
    } else {
      setMessage(`You need the ${targetRoom.requiredRole} role to enter this room. Complete the challenge to level up!`);
    }
  };

  const handleRoleUp = (newRole) => {
    updateUserRole(username, newRole);
    onRoleChange(newRole);
    setShowChallenge(false);
    setMessage(`Congratulations! You are now a ${newRole}!`);
  };

  const handleDeleteAccount = () => {
    deleteUser(username);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Geography Adventure</h2>
            <p className="text-gray-400">Welcome, {username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 px-4 py-2 rounded-full">
            <span className="text-white font-semibold">Role: {role}</span>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
        {/* Room Description */}
        <div className="col-span-2 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">
            {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            {GAME_ROOMS[currentRoom].description}
          </p>
          
          {message && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Available Paths:</h4>
            <div className="grid grid-cols-2 gap-4">
              {GAME_ROOMS[currentRoom].nextRooms.map((room) => (
                <button
                  key={room}
                  onClick={() => navigateToRoom(room)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
                >
                  {room.split(/(?=[A-Z])/).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Character Status */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Character Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Current Role:</span>
                <span className="text-blue-400">{role}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Location:</span>
                <span className="text-green-400">{currentRoom}</span>
              </div>
            </div>
          </div>

          {/* Challenge Section */}
          {!showChallenge && role !== 'Master' && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Role Advancement</h3>
              <p className="text-gray-300 mb-4">
                Ready to advance your role? Take on a geography challenge!
              </p>
              <button 
                onClick={() => setShowChallenge(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
              >
                Take Geography Challenge
              </button>
            </div>
          )}

          {showChallenge && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <RoleChallenge 
                username={username}
                currentRole={role}
                onRoleUp={handleRoleUp}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col items-center">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg text-center w-full max-w-xl">
            <p className="text-white mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;