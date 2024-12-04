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

export default CelebrationModal;