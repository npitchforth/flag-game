import { supabase } from '../config/supabase';
import { getDeviceId } from './deviceId';

/**
 * Logs a single question attempt to the database.
 * @param {object} logData - The data to be logged.
 * @param {string} logData.gameSessionId - The ID for the current game session.
 * @param {string} logData.questionCountryCode - The code of the country that was the correct answer.
 * @param {string[]} logData.optionCountryCodes - The codes of the other flags shown as options.
 * @param {string} logData.guessedCountryCode - The code of the country the user selected.
 * @param {boolean} logData.wasCorrect - Whether the user's guess was correct.
 * @param {string} logData.difficulty - The current game difficulty.
 * @param {boolean} logData.sovereignOnlyMode - Whether the "countries only" mode was active.
 */
export async function logQuestionAttempt(logData) {
  try {
    const deviceId = await getDeviceId();

    const { error } = await supabase
      .from('question_log')
      .insert([{
        game_session_id: logData.gameSessionId,
        device_id: deviceId,
        question_country_code: logData.questionCountryCode,
        option_country_codes: logData.optionCountryCodes,
        guessed_country: logData.guessedCountryCode,
        was_correct: logData.wasCorrect,
        difficulty: logData.difficulty,
        sovereign_only_mode: logData.sovereignOnlyMode,
      }]);

    if (error) {
      console.error('Error logging question attempt:', error);
      // We don't throw an error here because logging failure should not crash the game.
    }
  } catch (err) {
    console.error('An unexpected error occurred in logQuestionAttempt:', err);
  }
} 