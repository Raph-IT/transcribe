-- Create subscriptions table
CREATE TABLE subscriptions (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan_id text NOT NULL,
    status text NOT NULL,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    cancel_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create billing_history table
CREATE TABLE billing_history (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    subscription_id uuid REFERENCES subscriptions NOT NULL,
    amount integer NOT NULL,
    currency text NOT NULL,
    stripe_invoice_id text,
    status text NOT NULL,
    billing_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create usage_records table
CREATE TABLE usage_records (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    subscription_id uuid REFERENCES subscriptions,
    type text NOT NULL,
    quantity integer NOT NULL,
    recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add subscription_id to users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_id uuid REFERENCES subscriptions;

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own billing history"
    ON billing_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage records"
    ON usage_records FOR SELECT
    USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX billing_history_user_id_idx ON billing_history(user_id);
CREATE INDEX billing_history_subscription_id_idx ON billing_history(subscription_id);
CREATE INDEX usage_records_user_id_idx ON usage_records(user_id);
CREATE INDEX usage_records_subscription_id_idx ON usage_records(subscription_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
