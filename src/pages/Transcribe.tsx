import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload,
  FileAudio,
  Trash2,
  Clock,
  Search,
  Calendar,
  Globe2,
  Info,
  ChevronDown,
  ChevronUp,
  Users,
  Tag,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { transcribeAudio, formatTranscription } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { checkQuota } from '../utils/quotas';
import TagSelector from '../components/TagSelector';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

interface AudioFile {
  file: File;
  duration: number;
  url: string;
}

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
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
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

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

const Transcribe = () => {
  const { user } = useAuth();
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<{
    used: number;
    limit: number;
    remaining: number;
  } | null>(null);
  const [transcriptionInfo, setTranscriptionInfo] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    tags: [] as string[]
  });
  const [language, setLanguage] = useState('auto');
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkQuota(user.id, 0).then(({ quota }) => {
        setQuotaInfo({
          used: quota.used,
          limit: quota.limit,
          remaining: quota.remaining
        });
      });
      fetchTranscriptions();
    }
  }, [user]);

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Le fichier est trop volumineux (max 2 GB)');
      return;
    }

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      setAudioFile({
        file,
        duration: audio.duration,
        url
      });
      // Suggérer un titre basé sur le nom du fichier
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Enlever l'extension
      setTranscriptionInfo(prev => ({
        ...prev,
        title: fileName
      }));
    };

    audio.onerror = () => {
      toast.error('Erreur lors du chargement du fichier audio');
      URL.revokeObjectURL(url);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.mp4', '.mov', '.avi', '.mkv', '.flac', '.ogg', '.opus'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1
  });

  const startTranscription = async () => {
    if (!audioFile || !user) return;
    if (!transcriptionInfo.title.trim()) {
      toast.error('Veuillez entrer un titre pour la transcription');
      return;
    }

    const duration = Math.round(audioFile.duration);
    const { canTranscribe, quota } = await checkQuota(user.id, duration);

    if (!canTranscribe) {
      toast.error(
        `Quota mensuel dépassé. Il vous reste ${formatDuration(quota.remaining)} sur ${formatDuration(quota.limit)}. Passez au plan supérieur pour plus de temps.`,
        { duration: 5000 }
      );
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Transcription en cours...');

    try {
      const rawTranscriptionText = await transcribeAudio(audioFile.file, language);
      
      // Formater la transcription avec GPT
      const formattedText = await formatTranscription(rawTranscriptionText, language);

      const { error } = await supabase
        .from('transcriptions')
        .insert([{
          user_id: user.id,
          file_name: audioFile.file.name,
          language,
          status: 'completed',
          transcription_text: formattedText,
          duration: Math.round(audioFile.duration),
          title: transcriptionInfo.title,
          description: transcriptionInfo.description,
          tags: transcriptionInfo.tags,
          metadata: {
            date: transcriptionInfo.date
          }
        }]);

      if (error) throw error;

      setQuotaInfo({
        used: quota.used + duration,
        limit: quota.limit,
        remaining: quota.remaining - duration
      });

      toast.success('Transcription terminée avec succès !', { id: toastId });
      window.location.href = '/history';
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error('Erreur lors de la transcription', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header avec barre de recherche */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Transcriptions
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des transcriptions..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
              />
            </div>
            <button
              onClick={() => document.getElementById('upload-modal')?.showModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Nouvelle transcription
            </button>
          </div>
        </div>

        {/* Info quota */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Clock className="w-4 h-4" />
            <span>Temps de transcription restant ce mois : </span>
            <span className="font-medium">
              {quotaInfo ? formatDuration(quotaInfo.remaining) : '...'}
            </span>
            <span>sur</span>
            <span className="font-medium">
              {quotaInfo ? formatDuration(quotaInfo.limit) : '...'}
            </span>
          </div>
        </div>

        {/* Modal de téléchargement */}
        <dialog id="upload-modal" className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Nouvelle transcription
              </h2>
              <button 
                onClick={() => document.getElementById('upload-modal')?.close()}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Zone de dépôt */}
              {!audioFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                    }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Glissez-déposez un fichier audio ou vidéo ici, ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Formats supportés : MP3, WAV, M4A, MP4, MOV, AVI, MKV, FLAC, OGG • 2 GB max
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileAudio className="w-8 h-8 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {audioFile.file.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDuration(audioFile.duration)} • {formatFileSize(audioFile.file.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAudioFile(null)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Informations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={transcriptionInfo.title}
                    onChange={(e) => setTranscriptionInfo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Donnez un titre à votre transcription"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date (optionnel)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={transcriptionInfo.date}
                        onChange={(e) => setTranscriptionInfo(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Langue
                    </label>
                    <div className="relative">
                      <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary"
                      >
                        <option value="auto">Détection automatique</option>
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="de">Allemand</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={transcriptionInfo.description}
                    onChange={(e) => setTranscriptionInfo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ajoutez des détails sur le contenu..."
                    rows={3}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (optionnel)
                  </label>
                  <TagSelector
                    selectedTags={transcriptionInfo.tags}
                    onChange={(tags) => setTranscriptionInfo(prev => ({ ...prev, tags }))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Info className="w-4 h-4 mr-1" />
                Temps estimé : {audioFile ? formatDuration(audioFile.duration) : '0:00:00'}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => document.getElementById('upload-modal')?.close()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={startTranscription}
                  disabled={!audioFile || isProcessing}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                    ${!audioFile || isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                    }`}
                >
                  {isProcessing ? 'Transcription en cours...' : 'Démarrer la transcription'}
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* Liste des transcriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-400 dark:text-gray-500" role="status">
                <span className="sr-only">Chargement...</span>
              </div>
            </div>
          ) : (
            <div>
              {transcriptions.length === 0 ? (
                <div>
                  <FileAudio className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg mb-2">Aucune transcription pour le moment</p>
                  <p className="text-sm">
                    Commencez par télécharger un fichier audio ou vidéo à transcrire
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Vos transcriptions
                  </h2>
                  <ul>
                    {transcriptions.map(transcription => (
                      <li key={transcription.id} className="mb-4">
                        <div 
                          onClick={() => navigate(`/transcription/${transcription.id}`)}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileAudio className="w-8 h-8 text-primary" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {transcription.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(transcription.created_at)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(transcription.id);
                                }}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              >
                                <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                          {transcription.tags && transcription.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {transcription.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="bg-gray-100 dark:bg-gray-700/50 rounded-lg px-2 py-1 text-xs text-gray-500 dark:text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de suppression */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer la transcription"
          description="Êtes-vous sûr de vouloir supprimer cette transcription ?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Transcribe;