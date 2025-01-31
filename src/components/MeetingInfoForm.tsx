import React from 'react';
import { Users } from 'lucide-react';

interface MeetingInfo {
  platform: 'google_meet' | 'microsoft_teams' | 'zoom' | 'other';
  title: string;
  date: string;
  participants: string[];
  notes: string;
}

interface MeetingInfoFormProps {
  meetingInfo: MeetingInfo;
  onChange: (info: MeetingInfo) => void;
}

const MeetingInfoForm: React.FC<MeetingInfoFormProps> = ({ meetingInfo, onChange }) => {
  const handleParticipantsChange = (value: string) => {
    // Séparer les participants par virgule et nettoyer les espaces
    const participants = value.split(',').map(p => p.trim()).filter(p => p);
    onChange({ ...meetingInfo, participants });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Plateforme
        </label>
        <select
          value={meetingInfo.platform}
          onChange={(e) => onChange({ ...meetingInfo, platform: e.target.value as MeetingInfo['platform'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="google_meet">Google Meet</option>
          <option value="microsoft_teams">Microsoft Teams</option>
          <option value="zoom">Zoom</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titre de la réunion
        </label>
        <input
          type="text"
          value={meetingInfo.title}
          onChange={(e) => onChange({ ...meetingInfo, title: e.target.value })}
          placeholder="Ex: Réunion hebdomadaire équipe marketing"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date et heure
        </label>
        <input
          type="datetime-local"
          value={meetingInfo.date}
          onChange={(e) => onChange({ ...meetingInfo, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Participants
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            <Users className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={meetingInfo.participants.join(', ')}
            onChange={(e) => handleParticipantsChange(e.target.value)}
            placeholder="John Doe, Jane Smith (séparés par des virgules)"
            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Séparez les noms des participants par des virgules
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes additionnelles
        </label>
        <textarea
          value={meetingInfo.notes}
          onChange={(e) => onChange({ ...meetingInfo, notes: e.target.value })}
          rows={3}
          placeholder="Contexte, points importants à noter..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default MeetingInfoForm;
