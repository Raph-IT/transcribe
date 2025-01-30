-- Create transcriptions table
create table if not exists public.transcriptions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    file_name text not null,
    language text not null,
    status text not null,
    transcription_text text,
    summary text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security)
alter table public.transcriptions enable row level security;

-- Create policy to allow users to see only their own transcriptions
create policy "Users can view their own transcriptions"
    on public.transcriptions
    for select
    using (auth.uid() = user_id);

-- Create policy to allow users to insert their own transcriptions
create policy "Users can insert their own transcriptions"
    on public.transcriptions
    for insert
    with check (auth.uid() = user_id);

-- Create policy to allow users to update their own transcriptions
create policy "Users can update their own transcriptions"
    on public.transcriptions
    for update
    using (auth.uid() = user_id);

-- Create policy to allow users to delete their own transcriptions
create policy "Users can delete their own transcriptions"
    on public.transcriptions
    for delete
    using (auth.uid() = user_id);
