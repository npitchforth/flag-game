import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function addHighScore(scoreData) {
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
    }]);
  if (error) {
    console.error('Error saving score:', error);
    return null;
  }
  return data;
}

export async function getHighScores() {
  const { data, error } = await supabase
    .from('high_scores')
    .select('*') // Ensure this includes player_name
    .order('score', { ascending: false })
    .order('accuracy', { ascending: false })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching high scores:', error);
    return [];
  }
  
  // Transform the data to match the expected format
  return data.map(score => ({
    playerName: score.player_name, // Ensure this is included
    score: score.score,
    date: score.created_at,
    difficulty: score.difficulty,
    accuracy: score.accuracy,
    sovereignOnly: score.sovereign_only,
    streak: score.streak
  }));
}

