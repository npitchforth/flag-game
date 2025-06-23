import { createClient } from '@supabase/supabase-js';
import { getDeviceId, getDeviceInfo } from '../services/deviceId';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function addHighScore(scoreData) {
  try {
    // Get the device ID and platform info
    const deviceId = await getDeviceId();
    const deviceInfo = await getDeviceInfo(); // Get full device info
    const platform = deviceInfo.platform || 'unknown'; // Extract platform

    console.log(`[SUPABASE] Adding high score with deviceId: ${deviceId}, platform: ${platform}`);

    const { data, error } = await supabase
      .from('high_scores')
      .insert([{
        player_name: scoreData.playerName || 'anonymous',
        created_at: new Date().toISOString(),
        score: scoreData.score,
        difficulty: scoreData.difficulty,
        accuracy: scoreData.accuracy,
        sovereign_only: scoreData.sovereignOnly,
        streak: scoreData.streak || 0,
        device_id: deviceId,
        platform: platform, // Add platform to the score
      }]);
    if (error) {
      console.error('Error saving score:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error getting device info or saving score:', error);
    return null;
  }
}

export async function getHighScores() {
  const { data, error } = await supabase
    .from('high_scores')
    .select('*') // Ensure this includes player_name, device_id, and platform
    .order('score', { ascending: false })
    .order('accuracy', { ascending: false })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching high scores:', error);
    return [];
  }
  
  // Transform the data to match the expected format
  return data.map(score => ({
    playerName: score.player_name,
    score: score.score,
    date: score.created_at,
    difficulty: score.difficulty,
    accuracy: score.accuracy,
    sovereignOnly: score.sovereign_only,
    streak: score.streak,
    deviceId: score.device_id,
    platform: score.platform // Include platform
  }));
}

export async function getPersonalBestScores() {
  try {
    // Get the current device ID to get scores from this device only
    const currentDeviceId = await getDeviceId();
    
    const { data, error } = await supabase
      .from('high_scores')
      .select('*')
      .eq('device_id', currentDeviceId) // Only scores from current device
      .order('score', { ascending: false })
      .order('accuracy', { ascending: false })
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching personal best scores:', error);
      return [];
    }
    
    // Transform the data to match the expected format
    return data.map(score => ({
      playerName: score.player_name,
      score: score.score,
      date: score.created_at,
      difficulty: score.difficulty,
      accuracy: score.accuracy,
      sovereignOnly: score.sovereign_only,
      streak: score.streak,
      deviceId: score.device_id,
      platform: score.platform
    }));
  } catch (error) {
    console.error('Error getting device ID or fetching personal best scores:', error);
    return [];
  }
}

