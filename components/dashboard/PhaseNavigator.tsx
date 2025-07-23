
import React from 'react';
import { PHASES } from '../../constants';
import Button from '../shared/Button';
import { PhaseInfo } from '../../types';
// Fix: Import Card component
import Card from '../shared/Card';

interface PhaseNavigatorProps {
  currentPhaseId: number;
  onNextStep: () => void;
  isModuleLocked?: boolean;
}

const PhaseNavigator: React.FC<PhaseNavigatorProps> = ({ currentPhaseId, onNextStep, isModuleLocked }) => {
  const currentPhaseInfo: PhaseInfo | undefined = PHASES.find(p => p.id === currentPhaseId);

  return (
    <Card title="Brand Phase Navigator" className="bg-gradient-to-br from-primary to-purple-700 text-white">
      {currentPhaseInfo ? (
        <div>
          <h4 className="text-2xl font-bold">Current: {currentPhaseInfo.title}</h4>
          <p className="mt-2 mb-4 text-purple-200">{currentPhaseInfo.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-white">
              Phase {currentPhaseInfo.id}
            </span>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-white">
              Module: {currentPhaseInfo.module}
            </span>
          </div>
        </div>
      ) : (
        <p>Phase information not available.</p>
      )}
      <div className="mt-6">
        <Button 
          onClick={onNextStep} 
          disabled={currentPhaseId >= PHASES.length - 1 || isModuleLocked}
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto bg-white !text-primary hover:bg-neutral-100"
        >
          {isModuleLocked ? "Complete Current Tasks" : (currentPhaseId >= PHASES.length - 1 ? "Final Phase Reached" : "Proceed to Next Step")}
        </Button>
        {isModuleLocked && <p className="text-sm text-purple-200 mt-2">Unlock more features by completing onboarding tasks.</p>}
      </div>
    </Card>
  );
};

export default PhaseNavigator;