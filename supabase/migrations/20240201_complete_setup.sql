-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Table des préférences utilisateur
create table if not exists public.user_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    default_language varchar(10) default 'fr' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint user_preferences_user_id_key unique (user_id)
);

-- Table des transcriptions
create table if not exists public.transcriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    content text,
    audio_url text,
    language varchar(10) default 'fr',
    status varchar(50) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    translation_status jsonb default '{}'::jsonb,
    translations jsonb default '{}'::jsonb
);

-- Table des abonnements
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    plan_id varchar(50) not null,
    status varchar(50) not null,
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    cancel_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table de l'historique de facturation
create table if not exists public.billing_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    amount integer not null,
    currency varchar(3) not null,
    status varchar(50) not null,
    billing_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies pour la sécurité au niveau des lignes (RLS)
alter table public.user_preferences enable row level security;
alter table public.transcriptions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_history enable row level security;

-- Policies pour user_preferences
create policy "Users can view their own preferences"
    on public.user_preferences for select
    using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
    on public.user_preferences for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
    on public.user_preferences for update
    using (auth.uid() = user_id);

-- Policies pour transcriptions
create policy "Users can view their own transcriptions"
    on public.transcriptions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transcriptions"
    on public.transcriptions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transcriptions"
    on public.transcriptions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own transcriptions"
    on public.transcriptions for delete
    using (auth.uid() = user_id);

-- Policies pour subscriptions
create policy "Users can view their own subscription"
    on public.subscriptions for select
    using (auth.uid() = user_id);

-- Policies pour billing_history
create policy "Users can view their own billing history"
    on public.billing_history for select
    using (auth.uid() = user_id);

-- Fonctions pour la mise à jour automatique des timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Triggers pour la mise à jour automatique des timestamps
create trigger handle_updated_at
    before update on public.user_preferences
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.transcriptions
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();
