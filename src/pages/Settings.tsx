import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { Settings as SettingsIcon, CreditCard, Bell, Key, Download, ExternalLink, Globe2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

interface Subscription {
  plan_id: string;
  status: string;
  current_period_end: string;
  cancel_at: string | null;
}

interface BillingHistory {
  id: string;
  amount: number;
  currency: string;
  billing_date: string;
  status: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscriptionError) {
        if (subscriptionError.code === '42P01') {
          setSubscription(null);
        } else {
          console.error('Error fetching subscription:', subscriptionError);
          toast.error('Erreur lors du chargement de l\'abonnement');
        }
      } else {
        setSubscription(subscriptionData);
      }

      const { data: billingData, error: billingError } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('billing_date', { ascending: false })
        .limit(5);

      if (billingError) {
        if (billingError.code === '42P01') {
          setBillingHistory([]);
        } else {
          console.error('Error fetching billing history:', billingError);
          toast.error('Erreur lors du chargement de l\'historique de facturation');
        }
      } else {
        setBillingHistory(billingData || []);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Erreur lors du chargement des données d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          </div>

          {/* Profil */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
                <User className="w-5 h-5" />
                Profil
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Préférences de langue */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
                <Globe2 className="w-5 h-5" />
                Préférences de langue
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Langue par défaut pour les transcriptions
                  </label>
                  <select
                    id="language"
                    value={preferences?.defaultLanguage || 'fr'}
                    onChange={(e) => updatePreferences({ defaultLanguage: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                    <option value="it">Italien</option>
                    <option value="pt">Portugais</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Abonnement */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
                <CreditCard className="w-5 h-5" />
                Abonnement
              </h2>
              <div className="space-y-4">
                {subscription ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan actuel</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                          {subscription.plan_id === 'free' ? 'Gratuit' : 'Premium'}
                        </p>
                      </div>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Gérer l'abonnement
                      </Link>
                    </div>
                    {subscription.plan_id !== 'free' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Prochain renouvellement le {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Aucun abonnement actif</p>
                    <Link
                      to="/pricing"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Voir les plans
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Historique de facturation */}
            {billingHistory.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Historique de facturation
                  </h3>
                  <div className="space-y-4">
                    {billingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-600 dark:text-gray-400">
                            {formatDate(item.billing_date)}
                          </div>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {formatAmount(item.amount, item.currency)}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'succeeded'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                          }`}
                        >
                          {item.status === 'succeeded' ? 'Payé' : 'Échoué'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}