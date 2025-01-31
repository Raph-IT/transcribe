import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import { Tag, Save, Trash2, FileText, Clock, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TagSelector from '../components/TagSelector';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Modal from '../components/Modal';
import { summarizeTranscription } from '../lib/openai';

interface Transcription {
  id: string;
  file_name: string;
  language: string;
  status: string;
  created_at: string;
  transcription_text: string | null;
  title: string;
  description: string | null;
  duration: number;
  tags: string[];
  metadata: {
    date: string;
  };
  summary: string | null;
}

const TranscriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedText, setEditedText] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    fetchTranscription();
  }, [id]);

  const fetchTranscription = async () => {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setTranscription(data);
      setEditedTitle(data.title);
      setEditedDescription(data.description || '');
      setEditedTags(data.tags || []);
      setEditedText(data.transcription_text || '');
    } catch (error: any) {
      console.error('Error fetching transcription:', error.message);
      toast.error('Erreur lors du chargement de la transcription');
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .update({
          title: editedTitle,
          description: editedDescription,
          tags: editedTags,
          transcription_text: editedText
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transcription mise à jour avec succès');
      setIsEditing(false);
      fetchTranscription();
    } catch (error: any) {
      console.error('Error updating transcription:', error.message);
      toast.error('Erreur lors de la mise à jour de la transcription');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transcription supprimée avec succès');
      navigate('/transcribe');
    } catch (error: any) {
      console.error('Error deleting transcription:', error.message);
      toast.error('Erreur lors de la suppression de la transcription');
    }
  };

  const generateSummary = async () => {
    if (!transcription?.transcription_text) {
      toast.error('Aucun texte à résumer');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summaryText = await summarizeTranscription(transcription.transcription_text, transcription.language);

      const { error: updateError } = await supabase
        .from('transcriptions')
        .update({
          summary: summaryText
        })
        .eq('id', id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw updateError;
      }

      toast.success('Résumé généré avec succès');
      fetchTranscription();
    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast.error(error.message || 'Erreur lors de la génération du résumé');
    } finally {
      setIsGeneratingSummary(false);
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

  if (!transcription) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl font-bold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transcription.title}
                </h1>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(transcription.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor(transcription.duration / 60)} minutes
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FileText className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h2>
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
                rows={3}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                {transcription.description || 'Aucune description'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tags
            </h2>
            {isEditing ? (
              <TagSelector
                selectedTags={editedTags}
                onTagsChange={setEditedTags}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {transcription.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Transcription */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transcription
              </h2>
              {!isEditing && (
                <button
                  onClick={generateSummary}
                  disabled={isGeneratingSummary}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingSummary ? 'Génération...' : 'Générer un résumé'}
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 font-mono"
                rows={10}
              />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {transcription.transcription_text || 'Aucune transcription'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Summary */}
          {transcription.summary && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Résumé
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {transcription.summary}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer la transcription"
          message="Êtes-vous sûr de vouloir supprimer cette transcription ? Cette action est irréversible."
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default TranscriptionDetail;
