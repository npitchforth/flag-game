// Content filtering utility for player names using bad-words library
// This helps maintain a family-friendly environment on the leaderboard

import { Filter } from 'bad-words';

// Initialize the bad-words filter
const filter = new Filter();

// Add some additional gaming-related terms that might be considered inappropriate
filter.addWords(
  'noob', 'n00b', 'l33t', 'h4x0r', 'hacker', 'cheater',
  'idiot', 'stupid', 'dumb', 'moron', 'imbecile',
  'fat', 'ugly', 'loser', 'nerd', 'geek', 'virgin'
);

// Common letter substitutions and patterns for profanity
const LETTER_SUBSTITUTIONS = {
  'a': ['@', '4', '*'],
  'e': ['3', '*'],
  'i': ['1', '!', '*'],
  'o': ['0', '*'],
  's': ['$', '5', '*'],
  't': ['7', '*'],
  'u': ['*'],
  'c': ['k', '*'],
  'k': ['c', '*'],
  'f': ['ph', '*'],
  'ck': ['k', 'c', '*'],
  'sh': ['$', '5', '*'],
  'th': ['*'],
  'ph': ['f', '*']
};

// Additional patterns for common profanity with asterisks
const ASTERISK_PATTERNS = [
  'f**k', 's**t', 'b**ch', 'a**', 'd**k', 'p**s',
  'f*ck', 's*it', 'b*tch', 'a*s', 'd*ck', 'p*ss',
  'f*cking', 's*itting', 'b*tching', 'a*shole', 'd*ckhead'
];

// Common profanity patterns to catch with substitutions
const PROFANITY_PATTERNS = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
  'crap', 'piss', 'dick', 'cock', 'pussy', 'cunt',
  'bastard', 'whore', 'slut', 'faggot', 'nigger', 'nigga',
  'fag', 'dyke', 'retard', 'spic', 'kike', 'chink',
  'fucker', 'fucking', 'motherfucker', 'shitty', 'bitchy',
  'asshole', 'dumbass', 'jackass', 'smartass', 'badass'
];

/**
 * Generates variations of a word with common letter substitutions
 * @param {string} word - The word to generate variations for
 * @returns {string[]} - Array of possible variations
 */
const generateSubstitutions = (word) => {
  const variations = [word];
  const lowerWord = word.toLowerCase();
  
  // Generate variations with common substitutions
  for (const [original, substitutes] of Object.entries(LETTER_SUBSTITUTIONS)) {
    if (lowerWord.includes(original)) {
      for (const substitute of substitutes) {
        const variation = lowerWord.replace(new RegExp(original, 'g'), substitute);
        if (!variations.includes(variation)) {
          variations.push(variation);
        }
      }
    }
  }
  
  return variations;
};

/**
 * Checks if text contains profanity with common substitutions
 * @param {string} text - The text to check
 * @returns {boolean} - True if profanity is found
 */
const containsProfanityWithSubstitutions = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  const lowerText = text.toLowerCase();
  
  // Check each profanity pattern
  for (const pattern of PROFANITY_PATTERNS) {
    // Generate variations of the profanity pattern
    const variations = generateSubstitutions(pattern);
    
    // Check if any variation is found in the text
    for (const variation of variations) {
      if (lowerText.includes(variation)) {
        return true;
      }
    }
  }
  
  // Check for common asterisk patterns
  for (const pattern of ASTERISK_PATTERNS) {
    if (lowerText.includes(pattern)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Checks if a string contains inappropriate content using bad-words library
 * @param {string} text - The text to check
 * @returns {boolean} - True if inappropriate content is found
 */
export const containsInappropriateContent = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return false;
  }
  
  // Use bad-words library to check for profanity
  if (filter.isProfane(trimmed)) {
    return true;
  }
  
  // Check for profanity with common substitutions
  if (containsProfanityWithSubstitutions(trimmed)) {
    return true;
  }
  
  // Check for excessive repetition (e.g., "aaaaaaaa", "!!!!!!!!")
  if (/(.)\1{7,}/.test(trimmed)) {
    return true;
  }
  
  // Check for excessive special characters
  const specialCharRatio = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length / trimmed.length;
  if (specialCharRatio > 0.5 && trimmed.length > 3) {
    return true;
  }
  
  return false;
};

/**
 * Filters a player name for display on the leaderboard
 * If the name contains inappropriate content, it returns "Anonymous Player"
 * Otherwise, it returns the original name
 * @param {string} playerName - The player name to filter
 * @returns {string} - The filtered name for display
 */
export const filterPlayerNameForDisplay = (playerName) => {
  if (!playerName || typeof playerName !== 'string') {
    return 'Anonymous Player';
  }
  
  const trimmed = playerName.trim();
  
  if (trimmed.length === 0) {
    return 'Anonymous Player';
  }
  
  // Check if the name contains inappropriate content using enhanced filtering
  if (containsInappropriateContent(trimmed)) {
    return 'Anonymous Player';
  }
  
  // Return the original name if it's appropriate
  return trimmed;
};

/**
 * Gets a cleaned version of text (replaces profanity with asterisks)
 * This is not used in the current implementation but available if needed
 * @param {string} text - The text to clean
 * @returns {string} - The cleaned text
 */
export const cleanText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return filter.clean(text);
};

 