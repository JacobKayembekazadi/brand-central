
import React, { useState, useEffect } from 'react';
import { WorldBible } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';

interface WorldBibleEditorProps {
  initialWorldBible: WorldBible;
  onSave: (worldBible: WorldBible) => void;
  addActivity: (description: string) => void;
}

const WorldBibleEditor: React.FC<WorldBibleEditorProps> = ({ initialWorldBible, onSave, addActivity }) => {
  const [wb, setWb] = useState<WorldBible>(initialWorldBible);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setWb(initialWorldBible);
    // Auto-enter edit mode if all fields are empty
    if (Object.values(initialWorldBible).every(value => {
      if (Array.isArray(value)) return value.length === 0;
      return value === '';
    })) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [initialWorldBible]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "vocabulary" || name === "forbiddenList") {
      setWb(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setWb(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(wb);
    addActivity("World Bible updated.");
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setWb(initialWorldBible);
    setIsEditing(false);
  }

  const fields: { name: keyof WorldBible, label: string, type: 'textarea' | 'tags', placeholder: string, rows?: number }[] = [
    { name: 'lore', label: 'Lore', type: 'textarea', placeholder: 'Describe the history, mythology, and core narrative of your brand world.', rows: 4 },
    { name: 'timeline', label: 'Timeline', type: 'textarea', placeholder: 'Key historical events or future milestones for your brand.', rows: 3 },
    { name: 'keyCharacters', label: 'Key Characters/Archetypes', type: 'textarea', placeholder: 'Describe important figures, personas, or archetypes within your brand world.', rows: 3 },
    { name: 'vocabulary', label: 'Brand Vocabulary (comma-separated)', type: 'tags', placeholder: 'e.g., Innovators, DreamWeavers, Pathfinders' },
    { name: 'forbiddenList', label: 'Forbidden List (comma-separated)', type: 'tags', placeholder: 'e.g., cheap, ordinary, follower' },
  ];

  return (
    <Card title="World Bible Editor (Phase 1)">
      <p className="text-sm text-neutral-600 mb-6">
        Define the narrative foundation of your brand. This includes its history, key figures, unique language, and terms to avoid.
      </p>
      {isEditing ? (
        <div className="space-y-6">
          {fields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-neutral-700 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={wb[field.name] as string}
                  onChange={handleChange}
                  rows={field.rows || 3}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              ) : (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={(wb[field.name] as string[]).join(', ')}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              )}
            </div>
          ))}
          <div className="flex space-x-3 pt-2">
            <Button onClick={handleSave}>Save World Bible</Button>
            <Button onClick={handleCancel} variant="outline">Cancel</Button>
          </div>
        </div>
      ) : (
         <div className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <h4 className="font-semibold text-neutral-800">{field.label}:</h4>
              <p className="text-neutral-600 whitespace-pre-wrap text-sm">
                {Array.isArray(wb[field.name]) 
                  ? (wb[field.name] as string[]).join(', ') || <span className="text-neutral-400 italic">Not defined.</span>
                  : (wb[field.name] as string) || <span className="text-neutral-400 italic">Not defined.</span>
                }
              </p>
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={() => setIsEditing(true)}>Edit World Bible</Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorldBibleEditor;
