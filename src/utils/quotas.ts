import { supabase } from '../lib/supabase';

// Quotas en secondes
export const QUOTAS = {
  FREE: 1800, // 30 minutes
  PRO: 18000, // 5 heures
  ENTERPRISE: Infinity
};

export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';

export const getUserQuota = async (userId: string): Promise<{
  used: number;
  limit: number;
  remaining: number;
  plan: PlanType;
}> => {
  // Par défaut, on considère que l'utilisateur est sur le plan gratuit
  let plan: PlanType = 'FREE';
  
  // TODO: Récupérer le plan de l'utilisateur depuis la table subscriptions
  // const { data: subscription } = await supabase
  //   .from('subscriptions')
  //   .select('plan')
  //   .eq('user_id', userId)
  //   .single();
  // if (subscription?.plan) {
  //   plan = subscription.plan;
  // }

  // Récupérer l'utilisation du mois en cours
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: transcriptions, error } = await supabase
    .from('transcriptions')
    .select('duration')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    throw new Error('Failed to fetch user quota');
  }

  const used = transcriptions.reduce((acc, t) => acc + (t.duration || 0), 0);
  const limit = QUOTAS[plan];
  const remaining = Math.max(0, limit - used);

  return {
    used,
    limit,
    remaining,
    plan
  };
};

export const checkQuota = async (userId: string, duration: number): Promise<{
  canTranscribe: boolean;
  quota: {
    used: number;
    limit: number;
    remaining: number;
    plan: PlanType;
  };
}> => {
  const quota = await getUserQuota(userId);
  return {
    canTranscribe: duration <= quota.remaining,
    quota
  };
};
