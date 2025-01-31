import { useState, useEffect } from 'react';
import { Plus, X, Tag as TagIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4F46E5');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('transcription_tags')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setAvailableTags(data);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    const { data, error } = await supabase
      .from('transcription_tags')
      .insert([
        {
          name: newTagName.trim(),
          color: newTagColor,
          description: ''
        }
      ])
      .select()
      .single();

    if (!error && data) {
      setAvailableTags([...availableTags, data]);
      onChange([...selectedTags, data.name]);
      setIsCreating(false);
      setNewTagName('');
    }
  };

  const toggleTag = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    onChange(newTags);
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
        {selectedTags.map(tagName => {
          const tag = availableTags.find(t => t.name === tagName);
          if (!tag) return null;
          
          return (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {tag.name}
              <button
                onClick={() => toggleTag(tag.name)}
                className="ml-1 hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher ou créer un tag..."
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary pr-20"
        />
        <button
          onClick={() => setIsCreating(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Liste des tags disponibles */}
      {searchQuery && (
        <div className="mt-2 space-y-1">
          {filteredTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`flex items-center w-full px-2 py-1 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                ${selectedTags.includes(tag.name) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              {tag.description && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {tag.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Modal de création de tag */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Créer un nouveau tag</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom du tag
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Ex: Cours, Meeting, Personnel..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={createTag}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
