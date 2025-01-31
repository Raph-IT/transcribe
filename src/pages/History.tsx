import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trash2, ChevronDown, ChevronUp, Users, Calendar, Video, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

interface Transcription {
  id: string;
  file_name: string;
  language: string;
  status: string;
  created_at: string;
  transcription_text: string | null;
  summary: string | null;
  meeting_platform: 'google_meet' | 'microsoft_teams' | 'zoom' | 'other' | null;
  meeting_date: string | null;
  meeting_title: string | null;
  meeting_participants: string[] | null;
  meeting_notes: string | null;
}

const platformIcons = {
  google_meet: '🎯',
  microsoft_teams: '👥',
  zoom: '🎥',
  other: '📅'
};

const platformNames = {
  google_meet: 'Google Meet',
  microsoft_teams: 'Microsoft Teams',
  zoom: 'Zoom',
  other: 'Autre'
};

const History = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const fetchTranscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranscriptions(data || []);
    } catch (error: any) {
      console.error('Error fetching transcriptions:', error.message);
      toast.error('Erreur lors du chargement des transcriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setTranscriptionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transcriptionToDelete) return;

    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', transcriptionToDelete);

      if (error) throw error;
      
      setTranscriptions(transcriptions.filter(t => t.id !== transcriptionToDelete));
      toast.success('Transcription supprimée avec succès');
    } finally {
      setDeleteModalOpen(false);
      setTranscriptionToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTranscriptions = transcriptions.filter(t => {
    const matchesSearch = searchTerm === '' || 
      t.meeting_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transcription_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.meeting_participants?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlatform = filterPlatform === 'all' || t.meeting_platform === filterPlatform;
    
    return matchesSearch && matchesPlatform;
  });

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des transcriptions</h1>
          
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par titre, contenu ou participant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Toutes les plateformes</option>
                <option value="google_meet">Google Meet</option>
                <option value="microsoft_teams">Microsoft Teams</option>
                <option value="zoom">Zoom</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTranscriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune transcription trouvée</p>
            ) : (
              filteredTranscriptions.map((transcription) => (
                <div key={transcription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {transcription.meeting_platform && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {platformIcons[transcription.meeting_platform]} {platformNames[transcription.meeting_platform]}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            {formatDate(transcription.meeting_date || transcription.created_at)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900">
                          {transcription.meeting_title || transcription.file_name}
                        </h3>
                        
                        {transcription.meeting_participants && transcription.meeting_participants.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{transcription.meeting_participants.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteClick(transcription.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === transcription.id ? null : transcription.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                        >
                          {expandedId === transcription.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedId === transcription.id && (
                      <div className="mt-4 border-t pt-4">
                        {transcription.meeting_notes && (
                          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                            <p className="text-sm text-gray-600">{transcription.meeting_notes}</p>
                          </div>
                        )}
                        
                        {transcription.summary && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Résumé</h4>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {transcription.summary}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription complète</h4>
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {transcription.transcription_text || 'Aucune transcription disponible'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setTranscriptionToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cette transcription ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </Layout>
  );
};

export default History;