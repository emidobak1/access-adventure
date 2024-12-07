export const GAME_ROOMS = {
  entrance: {
    description: "Welcome to the Explorer's Guild entrance hall! Here you can begin your geography adventure.",
    nextRoom: 'trainingRoom',
    nextRoomName: 'Training Room',
    requiredRole: null
  },
  trainingRoom: {
    description: "A room filled with maps and globes. This is where new explorers prove their knowledge.",
    nextRoom: 'worldMap',
    nextRoomName: 'World Map Room',
    requiredRole: 'Navigator'
  },
  worldMap: {
    description: "An impressive room with an enormous interactive world map.",
    nextRoom: 'masterHall',
    nextRoomName: 'Masters Hall',
    requiredRole: 'Master'
  },
  masterHall: {
    description: "The prestigious hall of Geography Masters. You've reached the highest level!",
    nextRoom: null,
    nextRoomName: null,
    requiredRole: 'Master'
  }
};

export const CHALLENGES = {
  trainingRoom: [
    {
      question: "What is the largest continent in the world?",
      answer: "asia",
      hint: "This continent includes countries like China and India"
    },
    {
      question: "Which ocean is the largest?",
      answer: "pacific",
      hint: "This ocean borders Asia and the Americas"
    }
  ],
  worldMap: [
    {
      question: "What is the capital city of France?",
      answer: "paris",
      hint: "This city is known as the 'City of Light'"
    },
    {
      question: "Which mountain range spans across seven countries in South America?",
      answer: "andes",
      hint: "This is the longest continental mountain range in the world"
    }
  ],
  masterHall: [
    {
      question: "Which continent is known as the 'Dark Continent'?",
      answer: "africa",
      hint: "This continent is home to the Sahara Desert"
    },
    {
      question: "What is the largest country in the world by land area?",
      answer: "russia",
      hint: "This country spans two continents"
    }
  ]
};