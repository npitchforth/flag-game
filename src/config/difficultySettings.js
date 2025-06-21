// Difficulty Settings Configuration
// Easy to adjust for testing purposes

export const difficultySettings = {
  easy: { 
    time: 45, 
    optionCount: 4,
    streakThreshold: 5, // Answers needed for a streak bonus
    streakTimeBonus: 3,   // Seconds to add for a bonus
    maxStreakBonuses: 3, // Max number of times bonus can be awarded
  },
  medium: { 
    time: 45, 
    optionCount: 4,
    streakThreshold: 5,
    streakTimeBonus: 3,
    maxStreakBonuses: 3,
  },
  hard: { 
    time: 45, 
    optionCount: 4,
    streakThreshold: 5,
    streakTimeBonus: 5,
    maxStreakBonuses: 3,
  }
};
