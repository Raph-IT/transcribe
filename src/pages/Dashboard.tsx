import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, FileText, History, Download, Settings, CreditCard, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';

interface Stats {
  totalTranscriptions: number;
  totalDuration: number;
  monthlyUsage: number;
  monthlyLimit: number;
}

interface RecentTranscription {
  id: string;
  meeting_title: string;
  created_at: string;
  duration: number;
  platform: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalTranscriptions: 0,
    totalDuration: 0,
    monthlyUsage: 0,
    monthlyLimit: 1800 // 30 minutes en secondes pour le plan gratuit
  });
  const [recentTranscriptions, setRecentTranscriptions] = useState<RecentTranscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques
      const { data: transcriptions, error: transcriptionsError } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', user?.id);

      if (transcriptionsError) throw transcriptionsError;

      // Calculer les statistiques
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyTranscriptions = transcriptions.filter(t => 
        new Date(t.created_at) >= firstDayOfMonth
      );

      setStats({
        totalTranscriptions: transcriptions.length,
        totalDuration: transcriptions.reduce((acc, t) => acc + (t.duration || 0), 0),
        monthlyUsage: monthlyTranscriptions.reduce((acc, t) => acc + (t.duration || 0), 0),
        monthlyLimit: 1800 // 30 minutes en secondes
      });

      // Récupérer les transcriptions récentes
      const recent = transcriptions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          meeting_title: t.meeting_title || t.file_name,
          created_at: t.created_at,
          duration: t.duration || 0,
          platform: t.meeting_platform
        }));

      setRecentTranscriptions(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/transcribe"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Clock className="h-4 w-4 mr-2" />
              Nouvelle transcription
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Temps utilisé ce mois</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatDuration(stats.monthlyUsage)}
                      </div>
                      <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        / {formatDuration(stats.monthlyLimit)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
              <div className="text-sm">
                <Link to="/pricing" className="font-medium text-primary hover:text-primary/90">
                  Augmenter la limite
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total transcriptions</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalTranscriptions}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
              <div className="text-sm">
                <Link to="/history" className="font-medium text-primary hover:text-primary/90">
                  Voir les détails
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Extension Chrome</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">Disponible</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
              <div className="text-sm">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Installer l'extension
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Plan actuel</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">Gratuit</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
              <div className="text-sm">
                <Link to="/pricing" className="font-medium text-primary hover:text-primary/90">
                  Passer au plan Pro
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Transcriptions récentes */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Transcriptions récentes</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTranscriptions.length > 0 ? (
                recentTranscriptions.map((transcription) => (
                  <li key={transcription.id}>
                    <Link to={`/history?id=${transcription.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary truncate">
                              {transcription.meeting_title}
                            </p>
                            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              {formatDuration(transcription.duration)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transcription.created_at)}</p>
                            <ChevronRight className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Aucune transcription récente
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Configuration rapide</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Download className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">
                        Installer l'extension Chrome
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Transcrivez vos réunions directement depuis votre navigateur
                      </p>
                    </div>
                  </div>
                </a>
                <Link to="/settings" className="group block">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Settings className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">
                        Configurer vos préférences
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Personnalisez les paramètres de transcription
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ressources</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">
                        Guide de démarrage
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Apprenez à utiliser l'extension et le site web
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">
                        FAQ
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Réponses aux questions fréquentes
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="mailto:support@transcriptor.com"
                  className="group block"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">
                        Support
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Contactez notre équipe pour obtenir de l'aide
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}