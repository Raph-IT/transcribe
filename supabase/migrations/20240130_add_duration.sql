-- Add duration column to transcriptions table
alter table public.transcriptions 
add column if not exists duration integer default 0;

-- Add comment to explain the column
comment on column public.transcriptions.duration is 'Duration of the audio in seconds';
