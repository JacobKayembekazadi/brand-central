
import React, { useState, useEffect } from 'react';
import { CompetitiveAnalysisData } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';

interface CompetitiveAnalysisInputProps {
  initialData: CompetitiveAnalysisData;
  onSave: (data: CompetitiveAnalysisData) => void;
  addActivity: (description: string) => void;
}

const CompetitiveAnalysisInput: React.FC<CompetitiveAnalysisInputProps> = ({ initialData, onSave, addActivity }) => {
  const [notes, setNotes] = useState<string>(initialData.notes);
  const [isEditing, setIsEditing] = useState<boolean>(!initialData.notes); // Start editing if notes are empty

  useEffect(() => {
    setNotes(initialData.notes);
    if (!initialData.notes && !isEditing) { // If externally cleared and not already editing
        setIsEditing(true);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({ notes });
    addActivity("Competitive Analysis notes saved.");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(initialData.notes);
    setIsEditing(false);
  }

  return (
    <Card title="Competitive Analysis Notes (Phase 0)">
      <p className="text-sm text-neutral-600 mb-4">
        Jot down insights about your competitors: their strengths, weaknesses, unique selling propositions, and market positioning. This replaces the conceptual "Competitive Moodboard" for now.
      </p>
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Enter your competitor analysis notes here..."
            aria-label="Competitive Analysis Notes"
          />
          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={notes === initialData.notes}>Save Notes</Button>
            {initialData.notes && <Button onClick={handleCancel} variant="outline">Cancel</Button>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notes ? (
            <p className="text-neutral-700 whitespace-pre-wrap p-3 bg-neutral-50 rounded-md border border-neutral-200">{notes}</p>
          ) : (
            <p className="text-neutral-500 italic">No competitive analysis notes entered yet.</p>
          )}
          <Button onClick={() => setIsEditing(true)} variant="outline">
            {notes ? 'Edit Notes' : 'Add Notes'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CompetitiveAnalysisInput;
