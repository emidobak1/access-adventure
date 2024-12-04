// src/components/DeleteAccount.js
const DeleteAccount = ({ username, onDelete, showConfirm, setShowConfirm }) => {
    return (
      <div className="mt-12 text-center">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-white mb-4">Are you sure you want to delete your account?</p>
            <div className="space-x-4">
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default DeleteAccount;