
import React, { useState } from 'react';
import { AudienceProfile } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';

interface AudienceArchitectProps {
  initialProfile: AudienceProfile;
  onSave: (profile: AudienceProfile) => void;
  addActivity: (description: string) => void;
}

const AudienceArchitect: React.FC<AudienceArchitectProps> = ({ initialProfile, onSave, addActivity }) => {
  const [profile, setProfile] = useState<AudienceProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState<boolean>(!initialProfile.pains && !initialProfile.dreams && !initialProfile.behaviors); // Start in edit if empty

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(profile);
    addActivity("Audience Profile updated in Audience Architect.");
    setIsEditing(false);
  };

  return (
    <Card title="Audience Architect">
      <p className="text-sm text-neutral-600 mb-4">
        Define your Ideal Customer Archetype. Focus on their pains, dreams, and behaviors to build a deep understanding.
      </p>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="pains" className="block text-sm font-medium text-neutral-700 mb-1">Pains & Frustrations</label>
            <textarea
              id="pains"
              name="pains"
              value={profile.pains}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="What keeps them up at night? What problems are they trying to solve?"
            />
          </div>
          <div>
            <label htmlFor="dreams" className="block text-sm font-medium text-neutral-700 mb-1">Dreams & Aspirations</label>
            <textarea
              id="dreams"
              name="dreams"
              value={profile.dreams}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="What are their biggest goals? What does success look like to them?"
            />
          </div>
          <div>
            <label htmlFor="behaviors" className="block text-sm font-medium text-neutral-700 mb-1">Behaviors & Habits</label>
            <textarea
              id="behaviors"
              name="behaviors"
              value={profile.behaviors}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Where do they spend their time online/offline? What influences their decisions?"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave}>Save Profile</Button>
            {!(!initialProfile.pains && !initialProfile.dreams && !initialProfile.behaviors) && ( // Don't show cancel if it was initially empty
                 <Button onClick={() => { setProfile(initialProfile); setIsEditing(false); }} variant="outline">Cancel</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-800">Pains & Frustrations:</h4>
            <p className="text-neutral-600 whitespace-pre-wrap">{profile.pains || "Not defined."}</p>
          </div>
           <div>
            <h4 className="font-semibold text-neutral-800">Dreams & Aspirations:</h4>
            <p className="text-neutral-600 whitespace-pre-wrap">{profile.dreams || "Not defined."}</p>
          </div>
           <div>
            <h4 className="font-semibold text-neutral-800">Behaviors & Habits:</h4>
            <p className="text-neutral-600 whitespace-pre-wrap">{profile.behaviors || "Not defined."}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </Card>
  );
};

export default AudienceArchitect;
    