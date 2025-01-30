import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';

interface Transcription {
  id: string;
  file_name: string;
  language: string;
  status: string;
  created_at: string;
  transcription_text: string | null;
  summary: string | null;
}

const History = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<string | null>(null);

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
    } catch (error: any) {
      console.error('Error deleting transcription:', error.message);
      toast.error('Erreur lors de la suppression');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des transcriptions</h1>
        
        <div className="space-y-4">
          {transcriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transcription trouvée</p>
          ) : (
            transcriptions.map((transcription) => (
              <div key={transcription.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{transcription.file_name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transcription.created_at)} • {transcription.language.toUpperCase()}
                      </p>
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
                  
                  {expandedId === transcription.id && transcription.transcription_text && (
                    <div className="mt-4 border-t pt-4 prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {transcription.transcription_text}
                      </ReactMarkdown>
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
    </>
  );
};

export default History;