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

//log the supabase key and url to console for debugging
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase KEY:', process.env.SUPABASE_KEY);