import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileAudio, 
  Trash2, 
  Play, 
  Pause, 
  Wand2,
  Download,
  Copy,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { transcribeAudio, formatTranscription, summarizeTranscription } from '../lib/openai';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AudioFile {
  file: File;
  duration: number;
  url: string;
}

interface TranscriptionResult {
  text: string;
  id: string;
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

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const Transcribe = () => {
  const { user } = useAuth();
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptionProgress, setTranscriptionProgress] = useState<number | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [language, setLanguage] = useState('fr');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Le fichier est trop volumineux (max 500 MB)');
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
    };

    audio.onerror = () => {
      toast.error('Erreur lors du chargement du fichier audio');
      URL.revokeObjectURL(url);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1,
    disabled: transcriptionProgress !== null
  });

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDelete = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.url);
      setAudioFile(null);
      setCurrentTime(0);
      setIsPlaying(false);
      setTranscriptionProgress(null);
      setTranscriptionResult(null);
    }
  };

  const handleCopy = async () => {
    if (!transcriptionResult) return;
    
    try {
      await navigator.clipboard.writeText(transcriptionResult.text);
      toast.success('Transcription copiée dans le presse-papier');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleDownloadPDF = () => {
    if (!transcriptionResult) return;

    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(transcriptionResult.text, 180);
    
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text(splitText, 15, 20);
    doc.save('transcription.pdf');
  };

  const startTranscription = async () => {
    if (!audioFile || !user) return;

    setTranscriptionProgress(0);
    setIsProcessing(true);
    const toastId = toast.loading('Transcription en cours...');

    try {
      const rawTranscriptionText = await transcribeAudio(
        audioFile.file,
        language,
        (progress) => setTranscriptionProgress(progress)
      );

      // Format the transcription
      const formattedText = await formatTranscription(rawTranscriptionText, language);

      const { data, error } = await supabase
        .from('transcriptions')
        .insert([
          {
            user_id: user.id,
            file_name: audioFile.file.name,
            language,
            status: 'completed',
            transcription_text: formattedText
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTranscriptionResult({
        text: formattedText,
        id: data.id
      });

      toast.success('Transcription terminée avec succès !', { id: toastId });
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error(error.message || 'Erreur lors de la transcription', { id: toastId });
    } finally {
      setIsProcessing(false);
      setTranscriptionProgress(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcriptionResult) return;

    const toastId = toast.loading('Génération du résumé...');
    try {
      const summaryText = await summarizeTranscription(transcriptionResult.text, language);
      setSummary(summaryText);
      toast.success('Résumé généré avec succès !', { id: toastId });
    } catch (error: any) {
      console.error('Summary error:', error);
      toast.error('Erreur lors de la génération du résumé', { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transcription Audio</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Langue de la transcription
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
              <option value="it">Italien</option>
            </select>
          </div>

          {!audioFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-500'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? 'Déposez le fichier ici...'
                  : 'Déposez votre fichier audio ici ou cliquez pour parcourir'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Formats acceptés : MP3, WAV, M4A • Taille maximale : 500 MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <FileAudio className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">{audioFile.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDuration(audioFile.duration)} • {formatFileSize(audioFile.file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                    <p className="text-sm text-gray-500 min-w-[4rem]">
                      {formatDuration(currentTime)}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max={audioFile.duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-grow h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 min-w-[4rem]">
                      {formatDuration(audioFile.duration)}
                    </p>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioFile.url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </div>

              {transcriptionProgress !== null && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Progression de la transcription
                    </p>
                    <p className="text-sm text-gray-500">{transcriptionProgress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${transcriptionProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!transcriptionResult ? (
                <button
                  onClick={startTranscription}
                  disabled={transcriptionProgress !== null}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-white
                    ${transcriptionProgress === null
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors`}
                >
                  <Wand2 className="h-5 w-5" />
                  <span>Lancer la transcription</span>
                </button>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Transcription</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleGenerateSummary}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <span className="animate-spin mr-2">⚡</span>
                              Traitement...
                            </>
                          ) : (
                            'Générer un résumé'
                          )}
                        </button>
                        <button
                          onClick={handleCopy}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Copier
                        </button>
                        <button
                          onClick={handleDownloadPDF}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Télécharger PDF
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {transcriptionResult.text}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {summary && (
                    <div className="bg-white rounded-lg shadow p-6 mt-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé</h2>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcribe;