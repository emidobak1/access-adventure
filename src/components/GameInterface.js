// src/components/GameInterface.js
import React, { useState } from 'react';
import { GAME_ROOMS, CHALLENGES } from '../constants/gameConfig';
import { updateUserRole, deleteUser } from '../utils/authService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const CelebrationModal = ({ onClose, newRole }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <DotLottieReact
          src="https://lottie.host/fc1a79d1-d3b5-45fe-9a1a-c66b3cb4babe/yNMb7lWLVd.lottie"
          loop
          autoplay
          style={{ opacity: 0.2 }}
        />
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white mb-4">
          Congratulations!
        </h3>
        <div className="w-32 h-32 mx-auto mb-4">
          <DotLottieReact
            src="https://lottie.host/fc1a79d1-d3b5-45fe-9a1a-c66b3cb4babe/yNMb7lWLVd.lottie"
            loop
            autoplay
          />
        </div>
        <p className="text-xl text-blue-300 mb-6">
          You've earned the rank of {newRole}!
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
        >
          Continue Your Adventure
        </button>
      </div>
    </div>
  </div>
);

const GameInterface = ({ username, role, onLogout, onRoleChange }) => {
  const roleHierarchy = ['Explorer', 'Navigator', 'Master'];
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newRole, setNewRole] = useState('');

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    const challenges = CHALLENGES[GAME_ROOMS[currentRoom].nextRoom];
    
    if (answer.toLowerCase().trim() === challenges[currentQuestion].answer) {
      if (currentQuestion < challenges.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setMessage('Correct! Here\'s your next question.');
      } else {
        const nextRole = GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole;
        updateUserRole(username, nextRole);
        onRoleChange(nextRole);
        setNewRole(nextRole);
        setShowCelebration(true);
        setCurrentRoom(GAME_ROOMS[currentRoom].nextRoom);
        setShowChallenge(false);
        setCurrentQuestion(0);
        setAnswer('');
      }
    } else {
      setMessage('That\'s not correct. Try again!');
    }
  };

  const handleRoomChange = (roomName) => {
    if (roomName === 'entrance') {
      setCurrentRoom('entrance');
      setMessage('');
      setShowChallenge(false);
      setCurrentQuestion(0);
      return;
    }

    const targetRoom = GAME_ROOMS[roomName];
    const userRoleIndex = roleHierarchy.indexOf(role);
    const requiredRoleIndex = roleHierarchy.indexOf(targetRoom.requiredRole);

    if (!targetRoom.requiredRole || userRoleIndex >= requiredRoleIndex) {
      setCurrentRoom(roomName);
      setMessage(`Welcome to the ${targetRoom.nextRoomName || roomName}!`);
      setShowChallenge(false);
    } else {
      setShowChallenge(true);
      setMessage('');
    }
  };

  const handleDeleteAccount = () => {
    deleteUser(username);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {showCelebration && (
        <CelebrationModal
          onClose={() => setShowCelebration(false)}
          newRole={newRole}
        />
      )}

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg p-8">
        {/* Room Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
          </h3>
          <p className="text-gray-300 text-lg">
            {GAME_ROOMS[currentRoom].description}
          </p>
        </div>

        {message && (
          <div className="mb-8 bg-blue-900/50 border border-blue-700 text-blue-100 px-6 py-4 rounded-lg">
            {message}
          </div>
        )}

        {!showChallenge ? (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Choose Your Path:</h4>
            <div className="grid grid-cols-2 gap-4">
              {currentRoom !== 'entrance' && (
                <button
                  onClick={() => handleRoomChange('entrance')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg transition-colors text-lg"
                >
                  Return to Entrance
                </button>
              )}
              {GAME_ROOMS[currentRoom].nextRoom && (
                <button
                  onClick={() => handleRoomChange(GAME_ROOMS[currentRoom].nextRoom)}
                  className={`${
                    role === GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole ||
                    roleHierarchy.indexOf(role) > roleHierarchy.indexOf(GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-6 py-4 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2`}
                >
                  <span>Enter {GAME_ROOMS[currentRoom].nextRoomName}</span>
                  {(role === GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole ||
                    roleHierarchy.indexOf(role) > roleHierarchy.indexOf(GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole)) && (
                    <span className="text-xs bg-green-500 px-2 py-1 rounded">
                      Access Granted
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-xl font-bold text-white mb-6">
              Answer this question to proceed! (Question {currentQuestion + 1}/2)
            </h4>
            <p className="text-lg text-gray-300 mb-4">
              {CHALLENGES[GAME_ROOMS[currentRoom].nextRoom][currentQuestion].question}
            </p>
            <form onSubmit={handleChallengeSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                placeholder="Enter your answer"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Answer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChallenge(false);
                    setCurrentQuestion(0);
                    setAnswer('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel Challenge
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Account */}
        <div className="mt-12 text-center">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white mb-4">Are you sure you want to delete your account?</p>
              <div className="space-x-4">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInterface;