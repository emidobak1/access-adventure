// src/constants/gameConfig.js
export const GAME_ROOMS = {
    entrance: {
      description: "Welcome to the Geography Adventure! You're at the entrance hall of the Explorer's Guild. As a new Explorer, you can visit the Training Room to level up to Navigator, or explore the Garden.",
      requiredRole: null,
      nextRooms: ['trainingRoom', 'garden']
    },
    garden: {
      description: "A peaceful garden with maps and globes scattered around. Perfect for studying geography!",
      requiredRole: null,
      nextRooms: ['entrance']
    },
    trainingRoom: {
      description: "This is where Explorers train to become Navigators. Answer geography questions to prove your knowledge!",
      requiredRole: null,
      nextRooms: ['entrance', 'worldMap']
    },
    worldMap: {
      description: "A grand room with an enormous world map on the floor. Only Navigators can access this room to train to become Geography Masters.",
      requiredRole: 'Navigator',
      nextRooms: ['entrance', 'masterHall']
    },
    masterHall: {
      description: "The prestigious hall of Geography Masters. Only the most knowledgeable geographers can enter.",
      requiredRole: 'Master',
      nextRooms: ['entrance']
    }
  };
  
  export const CHALLENGES = {
    navigator: {
      question: "What is the largest continent in the world?",
      answer: "asia",
      hint: "This continent includes countries like China and India"
    },
    master: {
      question: "What is the capital city of France?",
      answer: "paris",
      hint: "This city is known as the 'City of Light'"
    }
  };