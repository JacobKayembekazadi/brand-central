
import React, { useState, useEffect } from 'react';
import { AudienceProfile, WorldBible, VisualIdentityKit, CompetitiveAnalysisData } from '../../types';
import AudienceArchitect from './AudienceArchitect';
import MacroFantasyGenerator from './MacroFantasyGenerator';
import Card from '../shared/Card';
import Button from '../shared/Button';
import WorldBibleEditor from './WorldBibleEditor';
import VisualIdentityKitEditor from './VisualIdentityKitEditor';
import Alert from '../shared/Alert';
import CompetitiveAnalysisInput from './CompetitiveAnalysisInput'; // New Import

interface WorldFoundryModuleProps {
  currentPhaseId: number;
  audienceProfile: AudienceProfile;
  updateAudienceProfile: (profile: AudienceProfile) => void;
  worldBible: WorldBible;
  updateWorldBible: (wb: WorldBible) => void;
  visualIdentityKit: VisualIdentityKit;
  updateVisualIdentityKit: (vik: VisualIdentityKit) => void;
  competitiveAnalysis: CompetitiveAnalysisData; // New Prop
  updateCompetitiveAnalysis: (ca: CompetitiveAnalysisData) => void; // New Prop
  addActivity: (description: string) => void;
  isLocked: boolean;
}

type WorldFoundrySection = 'positioning' | 'worldBible' | 'visualIdentity';

const TABS: { key: WorldFoundrySection, label: string, phases: number[], shortLabel: string }[] = [
    { key: 'positioning', label: 'Positioning (Focus: Phase 0)', phases: [0], shortLabel: 'Positioning' },
    { key: 'worldBible', label: 'World Bible (Focus: Phase 1)', phases: [1], shortLabel: 'World Bible' },
    { key: 'visualIdentity', label: 'Visual Identity (Focus: Phase 2)', phases: [2], shortLabel: 'Visual Identity' },
];

const WorldFoundryModule: React.FC<WorldFoundryModuleProps> = ({
  currentPhaseId,
  audienceProfile,
  updateAudienceProfile,
  worldBible,
  updateWorldBible,
  visualIdentityKit,
  updateVisualIdentityKit,
  competitiveAnalysis, 
  updateCompetitiveAnalysis, 
  addActivity,
  isLocked
}) => {
  const getInitialSection = (phaseId: number): WorldFoundrySection => {
    if (phaseId === 0) return 'positioning';
    if (phaseId === 1) return 'worldBible';
    if (phaseId === 2) return 'visualIdentity';
    // If currentPhaseId is beyond WF phases (e.g., user navigates directly to WF module when app is in phase 3+),
    // default to the last section of WorldFoundry or a sensible default.
    if (phaseId > 2) return 'visualIdentity'; 
    return 'positioning'; // Default for any other unexpected cases
  };

  const [activeSection, setActiveSection] = useState<WorldFoundrySection>(getInitialSection(currentPhaseId));
  
  // Effect to switch tab if currentPhaseId changes to a phase managed by WorldFoundry (0, 1, 2)
  useEffect(() => {
    let idealSection: WorldFoundrySection | undefined;
    if (currentPhaseId === 0) {
      idealSection = 'positioning';
    } else if (currentPhaseId === 1) {
      idealSection = 'worldBible';
    } else if (currentPhaseId === 2) {
      idealSection = 'visualIdentity';
    }

    if (idealSection && activeSection !== idealSection) {
      setActiveSection(idealSection);
    }
    // If currentPhaseId > 2, this effect doesn't force a change, allowing the user to
    // remain on their last viewed tab or the one set by getInitialSection.
  }, [currentPhaseId]); // Only dependent on currentPhaseId


  if (isLocked) {
    return (
      <div className="p-8 text-center">
        <Card>
          <div className="p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Module Locked</h2>
            <p className="text-neutral-500">
              The World-Foundry module is currently locked. Please complete earlier onboarding steps or advance your brand phase to unlock this section.
            </p>
          </div>
        </Card>
      </div>
    );
  }
  
  // Determine if an informational alert should be shown.
  // This is relevant if the overall app phase is beyond WorldFoundry's main scope (0,1,2),
  // but the user is viewing a WorldFoundry tab.
  const currentTabInfo = TABS.find(t => t.key === activeSection);
  const showPhaseMismatchAlert = currentPhaseId > 2 && currentTabInfo;


  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h1 className="text-3xl font-bold text-neutral-800">Module 1: The World-Foundry</h1>
        <p className="text-sm text-neutral-500 bg-neutral-200 px-3 py-1 rounded-full">
            Current Phase: {currentPhaseId}
        </p>
      </div>
      <p className="text-neutral-600">
        Dedicated to building your brand's foundation. This module helps you define your audience, core promise, narrative, and visual style across Phases 0, 1, and 2.
      </p>

      <div className="flex border-b border-neutral-200">
        {TABS.map(tab => (
          <Button
            key={tab.key}
            variant="ghost"
            onClick={() => setActiveSection(tab.key)}
            className={`py-3 px-4 font-medium text-sm sm:text-base rounded-none border-b-2
              ${activeSection === tab.key 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}
              ${!tab.phases.includes(currentPhaseId) && currentPhaseId < Math.min(...tab.phases) ? 'opacity-70' : ''}
            `}
            aria-pressed={activeSection === tab.key}
            aria-label={`Switch to ${tab.label} section`}
          >
            {tab.shortLabel}
          </Button>
        ))}
      </div>
      
      {showPhaseMismatchAlert && currentTabInfo && (
         <Alert 
            type="info" 
            message={`Your brand is currently in Phase ${currentPhaseId}. You are viewing the "${currentTabInfo.shortLabel}" section (typically for Phase ${currentTabInfo.phases.join('/')}) within World-Foundry.`} 
          />
      )}


      <div className="mt-6">
        {activeSection === 'positioning' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-neutral-700">Positioning Workspace (Phase 0 Focus)</h2>
            <AudienceArchitect 
              initialProfile={audienceProfile} 
              onSave={updateAudienceProfile}
              addActivity={addActivity}
            />
            <CompetitiveAnalysisInput
              initialData={competitiveAnalysis}
              onSave={updateCompetitiveAnalysis}
              addActivity={addActivity}
            />
            <MacroFantasyGenerator addActivity={addActivity} />
          </div>
        )}
        {activeSection === 'worldBible' && (
           <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-neutral-700">World Bible Editor (Phase 1 Focus)</h2>
            <WorldBibleEditor 
                initialWorldBible={worldBible}
                onSave={updateWorldBible}
                addActivity={addActivity}
            />
          </div>
        )}
        {activeSection === 'visualIdentity' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-neutral-700">Visual Identity Kit Editor (Phase 2 Focus)</h2>
            <VisualIdentityKitEditor
                initialVik={visualIdentityKit}
                onSave={updateVisualIdentityKit}
                addActivity={addActivity}
             />
            <Card title="Automated Mock-Grids (Concept)">
                <p className="text-neutral-500">Future Feature: Auto-generated social media grids and carousel templates reflecting brand's visual identity based on VIK data. (To be implemented)</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldFoundryModule;
