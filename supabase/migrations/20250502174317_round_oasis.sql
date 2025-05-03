/*
  # Game Statistics Schema

  1. New Tables
    - `game_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `game_type` (text) - The type of game played
      - `score` (integer) - Final score
      - `best_streak` (integer) - Best streak achieved
      - `time_spent` (integer) - Time spent in seconds
      - `created_at` (timestamptz)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_score` (integer) - Cumulative score across all games
      - `games_played` (integer) - Total number of games played
      - `belt_rank` (text) - Current belt rank
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create game_stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  game_type text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  time_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  total_score integer NOT NULL DEFAULT 0,
  games_played integer NOT NULL DEFAULT 0,
  belt_rank text NOT NULL DEFAULT 'white',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own game stats"
  ON game_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own game stats"
  ON game_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user progress
  INSERT INTO user_progress (user_id, total_score, games_played)
  VALUES (
    NEW.user_id,
    NEW.score,
    1
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_score = user_progress.total_score + NEW.score,
    games_played = user_progress.games_played + 1,
    belt_rank = CASE
      WHEN user_progress.total_score + NEW.score >= 10000 THEN 'black'
      WHEN user_progress.total_score + NEW.score >= 5000 THEN 'brown'
      WHEN user_progress.total_score + NEW.score >= 2500 THEN 'purple'
      WHEN user_progress.total_score + NEW.score >= 1000 THEN 'blue'
      ELSE 'white'
    END,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user progress
CREATE TRIGGER update_user_progress_on_game_completion
  AFTER INSERT ON game_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress();