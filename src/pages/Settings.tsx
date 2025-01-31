import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, CreditCard, Bell, Key, Download, ExternalLink } from 'lucide-react';
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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // Récupérer l'abonnement actif
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (subscriptionError) throw subscriptionError;
      setSubscription(subscriptionData);

      // Récupérer l'historique de facturation
      const { data: billingData, error: billingError } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('billing_date', { ascending: false })
        .limit(5);

      if (billingError) throw billingError;
      setBillingHistory(billingData);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <nav className="space-y-1" aria-label="Sidebar">
                  <a
                    href="#subscription"
                    className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-gray-50 rounded-md"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Abonnement et facturation
                  </a>
                  <a
                    href="#preferences"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <SettingsIcon className="h-5 w-5 mr-2" />
                    Préférences
                  </a>
                  <a
                    href="#notifications"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </a>
                  <a
                    href="#security"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    Sécurité
                  </a>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Abonnement */}
              <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Abonnement</h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {subscription ? `Plan ${subscription.plan_id}` : 'Plan Gratuit'}
                      </h3>
                      {subscription && (
                        <p className="mt-1 text-sm text-gray-500">
                          Renouvellement le {formatDate(subscription.current_period_end)}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Link
                        to="/pricing"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {subscription ? 'Changer de plan' : 'Passer au plan Pro'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique de facturation */}
              <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Historique de facturation</h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {billingHistory.length > 0 ? (
                    <div className="flow-root">
                      <ul role="list" className="-mb-8">
                        {billingHistory.map((bill, billIdx) => (
                          <li key={bill.id}>
                            <div className="relative pb-8">
                              {billIdx !== billingHistory.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                    <CreditCard className="h-5 w-5 text-white" />
                                  </span>
                                </div>
                                <div className="flex justify-between flex-1 min-w-0">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Facture du {formatDate(bill.billing_date)}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                                      {formatAmount(bill.amount, bill.currency)}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time dateTime={bill.billing_date}>
                                      {new Date(bill.billing_date).toLocaleDateString()}
                                    </time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun historique de facturation disponible</p>
                  )}
                </div>
              </div>

              {/* Extension Chrome */}
              <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Extension Chrome</h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex sm:items-center">
                      <Download className="h-8 w-8 text-gray-400" />
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">Extension Transcriptor</div>
                        <div className="mt-1 text-sm text-gray-500">
                          Transcrivez vos réunions directement depuis votre navigateur
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Installer
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}