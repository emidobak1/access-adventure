// src/components/RoomNavigation.js
const RoomNavigation = ({ currentRoom, role, roleHierarchy, GAME_ROOMS, onNavigate }) => {
    return (
      <div className="space-y-6">
        <h4 className="text-xl font-semibold text-white">Choose Your Path:</h4>
        <div className="grid grid-cols-2 gap-4">
          {currentRoom !== 'entrance' && (
            <button
              onClick={() => onNavigate('entrance')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg transition-colors text-lg"
            >
              Return to Entrance
            </button>
          )}
          {GAME_ROOMS[currentRoom].nextRoom && (
            <button
              onClick={() => onNavigate(GAME_ROOMS[currentRoom].nextRoom)}
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
    );
  };
  
  export default RoomNavigation;