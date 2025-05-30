import { supabase } from '../config/supabase';

export const highScoresService = {
  // Add a new high score
  async addHighScore(scoreData) {
    try {
      const { data, error } = await supabase
        .from('high_scores')
        .insert([{
          player_name: scoreData.playerName,
          score: scoreData.score,
          difficulty: scoreData.difficulty,
          accuracy: scoreData.accuracy,
          sovereign_only: scoreData.sovereignOnly,
          streak: scoreData.streak
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding high score:', error);
      throw error;
    }
  },

  // Get top scores with optional filters
  async getTopScores({ 
    limit = 10, 
    difficulty = null, 
    sovereignOnly = null,
    timeFrame = null // 'day', 'week', 'month', or null for all time
  } = {}) {
    try {
      let query = supabase
        .from('high_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      // Apply filters if provided
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (sovereignOnly !== null) {
        query = query.eq('sovereign_only', sovereignOnly);
      }
      if (timeFrame) {
        const now = new Date();
        let startDate;
        switch (timeFrame) {
          case 'day':
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = null;
        }
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching high scores:', error);
      throw error;
    }
  },

  // Get player's personal best
  async getPersonalBest(playerName) {
    try {
      const { data, error } = await supabase
        .from('high_scores')
        .select('*')
        .eq('player_name', playerName)
        .order('score', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] || null;
    } catch (error) {
      console.error('Error fetching personal best:', error);
      throw error;
    }
  }
}; 