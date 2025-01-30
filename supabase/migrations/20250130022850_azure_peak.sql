/*
  # Create transcriptions table and security policies

  1. New Tables
    - `transcriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `file_url` (text)
      - `language` (text)
      - `status` (text)
      - `transcription_text` (text, nullable)
      - `summary` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `transcriptions` table
    - Add policy for users to access only their own transcriptions
*/

CREATE TABLE IF NOT EXISTS transcriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  language text NOT NULL,
  status text NOT NULL,
  transcription_text text,
  summary text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own transcriptions"
  ON transcriptions
  FOR ALL
  USING (auth.uid() = user_id);