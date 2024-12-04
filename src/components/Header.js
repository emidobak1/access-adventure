// src/components/Header.js
const Header = ({ username, role, onLogout }) => {
    return (
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
    );
  };
  
  export default Header;