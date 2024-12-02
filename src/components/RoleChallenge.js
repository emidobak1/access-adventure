// src/components/RoleChallenge.js
import React, { useState } from 'react';
import { updateUserRole, completeChallenge } from '../utils/authService';
import { CHALLENGES } from '../constants/gameConfig';

const RoleChallenge = ({ username, currentRole, onRoleUp }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getChallengeDetails = () => {
    switch (currentRole) {
      case 'Explorer':
        return CHALLENGES.navigator;
      case 'Navigator':
        return CHALLENGES.master;
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const challenge = getChallengeDetails();
    
    if (!challenge) {
      setError('No challenge available');
      return;
    }

    if (answer.toLowerCase().trim() === challenge.answer) {
      const newRole = currentRole === 'Explorer' ? 'Navigator' : 'Master';
      
      updateUserRole(username, newRole);
      completeChallenge(username, newRole.toLowerCase());
      
      setSuccess(true);
      onRoleUp(newRole);
    } else {
      setError('That\'s not correct. Try again! You can use the hint if needed.');
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-4">Challenge Complete!</h3>
        <p className="text-green-400 font-bold mb-4">
          Congratulations! You've advanced from {currentRole} to {currentRole === 'Explorer' ? 'Navigator' : 'Master'}!
        </p>
        <p className="text-gray-300">
          You can now access new areas of the map!
        </p>
      </div>
    );
  }

  const challenge = getChallengeDetails();

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Geography Challenge</h3>
      <p className="text-gray-300 mb-2">Current Rank: {currentRole}</p>
      <p className="text-gray-300 mb-6">Answer correctly to advance to the next rank!</p>
      
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <p className="text-white font-medium">{challenge?.question}</p>
        {showHint && (
          <p className="text-yellow-300 mt-2">Hint: {challenge?.hint}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Type your answer here" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {error && (
          <p className="text-red-400">{error}</p>
        )}
        <button 
          type="button"
          onClick={() => setShowHint(true)}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors text-lg mb-2"
        >
          Show Hint
        </button>
        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};

export default RoleChallenge;