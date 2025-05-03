import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface GameStats {
  game_type: string;
  score: number;
  best_streak: number;
  time_spent: number;
}

export function useGameStats() {
  const saveGameStats = useCallback(async (stats: GameStats) => {
    try {
      const { error } = await supabase
        .from('game_stats')
        .insert([stats]);

      if (error) {
        console.error('Error saving game stats:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving game stats:', error);
      return false;
    }
  }, []);

  return { saveGameStats };
}