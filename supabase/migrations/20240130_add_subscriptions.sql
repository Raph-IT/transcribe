-- Create subscriptions table
create table if not exists public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    plan_id text not null,
    status text not null,
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    stripe_subscription_id text,
    stripe_customer_id text,
    cancel_at timestamp with time zone,
    canceled_at timestamp with time zone,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone
);

-- Set up RLS
alter table public.subscriptions enable row level security;

-- Create policy to allow users to see only their own subscriptions
create policy "Users can view own subscription"
    on public.subscriptions for select
    using (auth.uid() = user_id);

-- Create policy to allow service role to manage all subscriptions
create policy "Service role can manage all subscriptions"
    on public.subscriptions for all
    using (auth.role() = 'service_role');

-- Add comment
comment on table public.subscriptions is 'Stores subscription information for users';
