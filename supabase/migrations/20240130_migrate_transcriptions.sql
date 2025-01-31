-- Modifier la table transcriptions pour la nouvelle structure
ALTER TABLE transcriptions
  ADD COLUMN title text NOT NULL DEFAULT '',
  ADD COLUMN description text,
  ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN tags text[] DEFAULT '{}';

-- Supprimer la contrainte NOT NULL par défaut sur title
ALTER TABLE transcriptions
  ALTER COLUMN title DROP DEFAULT;

-- Create tags table for suggested/common tags
CREATE TABLE transcription_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,  -- Permettre NULL pour les tags système
  name text NOT NULL,
  color text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer un index unique qui gère correctement les tags système
CREATE UNIQUE INDEX idx_unique_tag_per_user 
  ON transcription_tags(name, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'));

-- Set up RLS for tags
ALTER TABLE transcription_tags ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own tags
CREATE POLICY "Users can manage their own tags"
  ON transcription_tags
  FOR ALL
  USING (auth.uid() = user_id);

-- Allow users to view system tags (where user_id is null)
CREATE POLICY "Users can view system tags"
  ON transcription_tags
  FOR SELECT
  USING (user_id IS NULL);

-- Insert some default system tags
INSERT INTO transcription_tags (user_id, name, color, description) VALUES
  (NULL, 'Meeting', '#4F46E5', 'Professional meetings and calls'),
  (NULL, 'Course', '#059669', 'Educational content and lectures'),
  (NULL, 'Interview', '#DC2626', 'Job interviews or research interviews'),
  (NULL, 'Personal', '#9333EA', 'Personal notes and thoughts'),
  (NULL, 'Podcast', '#D97706', 'Podcast episodes and audio content'),
  (NULL, 'Conference', '#2563EB', 'Conference talks and presentations');

COMMENT ON TABLE transcription_tags IS 'Stores custom and system-wide tags for transcriptions';

-- Add index for better performance on tag lookups
CREATE INDEX idx_transcription_tags_user_id ON transcription_tags(user_id);
CREATE INDEX idx_transcription_tags_name ON transcription_tags(name);
