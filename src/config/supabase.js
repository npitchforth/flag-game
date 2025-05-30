import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cuefsxwwatkdjjcpykqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZWZzeHd3YXRrZGpqY3B5a3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTExNjAsImV4cCI6MjA2NDA2NzE2MH0.GoG6yOHAIcVQvELQlY1Qt9ng123I3IY_4OKGY0q0oOM';

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
