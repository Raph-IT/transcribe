-- Ajouter une table pour les plateformes de réunion
create type meeting_platform as enum ('google_meet', 'microsoft_teams', 'zoom', 'other');

-- Ajouter les colonnes pour les informations de réunion
alter table transcriptions
add column meeting_platform meeting_platform,
add column meeting_date timestamp with time zone,
add column meeting_title text,
add column meeting_participants text[],
add column meeting_notes text;

-- Créer un index pour la recherche par date
create index transcriptions_meeting_date_idx on transcriptions(meeting_date);

-- Mettre à jour la politique RLS
alter policy "Users can only access their own transcriptions"
on transcriptions
using (auth.uid() = user_id);
