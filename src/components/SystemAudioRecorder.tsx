import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, Volume2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface SystemAudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

interface AudioQualitySettings {
  sampleRate: number;
  bitRate: number;
}

const QUALITY_PRESETS: Record<string, AudioQualitySettings> = {
  low: { sampleRate: 22050, bitRate: 96000 },
  medium: { sampleRate: 44100, bitRate: 128000 },
  high: { sampleRate: 48000, bitRate: 192000 }
};

const SystemAudioRecorder: React.FC<SystemAudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qualityPreset, setQualityPreset] = useState<string>('medium');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const drawAudioLevel = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);

    // Dessiner le visualiseur
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillStyle = 'rgb(99, 102, 241)';
    
    const barWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationFrameRef.current = requestAnimationFrame(drawAudioLevel);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          },
          ...QUALITY_PRESETS[qualityPreset]
        } as MediaTrackConstraints
      });

      // Configuration de l'analyseur audio
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: QUALITY_PRESETS[qualityPreset].bitRate
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `system-recording-${Date.now()}.webm`, {
          type: 'audio/webm'
        });
        
        // Créer un aperçu
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowPreview(true);

        // Arrêter la visualisation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Arrêter tous les tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Enregistrer par chunks de 1 seconde
      setIsRecording(true);
      setIsPaused(false);

      // Démarrer le timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Démarrer la visualisation
      drawAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(
        "Impossible d'accéder à l'audio système. Assurez-vous d'avoir accordé les permissions nécessaires.",
        { duration: 5000, icon: '⚠️' }
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      drawAudioLevel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handlePreviewComplete = () => {
    if (previewUrl) {
      const blob = chunksRef.current[0];
      const file = new File([blob], `system-recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      onRecordingComplete(file);
      setShowPreview(false);
      setPreviewUrl(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-md">
        <canvas
          ref={canvasRef}
          className="w-full h-16 bg-gray-50 rounded-lg mb-4"
          width={500}
          height={100}
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Bouton d'enregistrement/arrêt */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          title={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
        >
          {isRecording ? (
            <Square className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Bouton pause/reprendre */}
        {isRecording && (
          <button
            onClick={isPaused ? resumeRecording : pauseRecording}
            className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
            title={isPaused ? "Reprendre l'enregistrement" : "Mettre en pause"}
          >
            {isPaused ? (
              <Play className="h-6 w-6 text-white" />
            ) : (
              <Pause className="h-6 w-6 text-white" />
            )}
          </button>
        )}

        {/* Indicateur de niveau sonore */}
        {isRecording && !isPaused && (
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-gray-600" />
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-100"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Timer */}
        {(isRecording || recordingTime > 0) && (
          <div className="text-lg font-semibold text-gray-700">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Sélecteur de qualité */}
      <div className="flex items-center space-x-2">
        <Settings className="h-4 w-4 text-gray-600" />
        <select
          value={qualityPreset}
          onChange={(e) => setQualityPreset(e.target.value)}
          className="text-sm border rounded-md p-1"
          disabled={isRecording}
        >
          <option value="low">Qualité basse (22kHz)</option>
          <option value="medium">Qualité moyenne (44.1kHz)</option>
          <option value="high">Qualité haute (48kHz)</option>
        </select>
      </div>

      {/* Aperçu audio */}
      {showPreview && previewUrl && (
        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Aperçu de l'enregistrement</h3>
          <audio src={previewUrl} controls className="w-full mb-2" />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowPreview(false);
                setPreviewUrl(null);
                setRecordingTime(0);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              onClick={handlePreviewComplete}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Utiliser cet enregistrement
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>Enregistre l'audio système (meetings, appels, etc.)</span>
      </div>
    </div>
  );
};

export default SystemAudioRecorder;
