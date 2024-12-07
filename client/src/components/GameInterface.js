import React, { useState, useEffect } from 'react';
import { GAME_ROOMS, CHALLENGES } from '../constants/gameConfig';
import { updateUserRole, deleteUser, fetchRoleContent } from '../utils/authService';
import Header from './Header';
import DeleteAccount from './DeleteAccount';
import RoomNavigation from './RoomNavigation';
import CelebrationModal from './CelebrationModal';

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
  const [content, setContent] = useState(null);

  // Fetch role-specific content when role changes
  useEffect(() => {
    const loadContent = async () => {
      const token = localStorage.getItem('token');
      const data = await fetchRoleContent(token, role);
      if (data) {
        setContent(data.content);
      }
    };
    loadContent();
  }, [role]);

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();
    const challenges = CHALLENGES[GAME_ROOMS[currentRoom].nextRoom];
    
    if (answer.toLowerCase().trim() === challenges[currentQuestion].answer) {
      if (currentQuestion < challenges.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setMessage('Correct! Here\'s your next question.');
      } else {
        const nextRole = GAME_ROOMS[GAME_ROOMS[currentRoom].nextRoom].requiredRole;
        const token = localStorage.getItem('token');
        const result = await updateUserRole(token, nextRole);
        
        if (result) {
          onRoleChange(nextRole);
          setNewRole(nextRole);
          setShowCelebration(true);
          setCurrentRoom(GAME_ROOMS[currentRoom].nextRoom);
          setShowChallenge(false);
          setCurrentQuestion(0);
          setAnswer('');
        } else {
          setMessage('Error updating role. Please try again.');
        }
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

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const success = await deleteUser(token);
    if (success) {
      onLogout();
    } else {
      setMessage('Error deleting account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {showCelebration && (
        <CelebrationModal
          onClose={() => setShowCelebration(false)}
          newRole={newRole}
        />
      )}

      <Header username={username} role={role} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
          </h3>
          <p className="text-gray-300 text-lg">
            {GAME_ROOMS[currentRoom].description}
          </p>
          {content && (
            <div className="mt-4 text-blue-300">
              {content}
            </div>
          )}
        </div>

        {message && (
          <div className="mb-8 bg-blue-900/50 border border-blue-700 text-blue-100 px-6 py-4 rounded-lg">
            {message}
          </div>
        )}

        {showChallenge ? (
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-xl font-bold text-white mb-6">
              Answer this question to proceed! (Question {currentQuestion + 1}/2)
            </h4>
            <p className="text-lg text-gray-300 mb-4">
              {CHALLENGES[GAME_ROOMS[currentRoom].nextRoom][currentQuestion].question}
            </p>
            
            <div className="mb-4">
              <p className="text-yellow-300 text-sm">
                <span className="font-bold">Hint:</span>{' '}
                {CHALLENGES[GAME_ROOMS[currentRoom].nextRoom][currentQuestion].hint}
              </p>
            </div>

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
        ) : (
          <RoomNavigation
            currentRoom={currentRoom}
            role={role}
            roleHierarchy={roleHierarchy}
            GAME_ROOMS={GAME_ROOMS}
            onNavigate={handleRoomChange}
          />
        )}
        <DeleteAccount
          username={username}
          onDelete={handleDeleteAccount}
          showConfirm={showDeleteConfirm}
          setShowConfirm={setShowDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default GameInterface;