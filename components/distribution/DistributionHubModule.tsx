
import React from 'react';
import Card from '../shared/Card';

interface DistributionHubModuleProps {
  currentPhaseId: number;
  isLocked: boolean;
}

const DistributionHubModule: React.FC<DistributionHubModuleProps> = ({ currentPhaseId, isLocked }) => {
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
              The Distribution & Analytics Hub module is currently locked. Please complete earlier onboarding steps or advance your brand phase.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Relevant phases for Distribution Hub: 4, 9
  const relevantPhases = [4, 9];
  const isFocusPhase = relevantPhases.includes(currentPhaseId);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h1 className="text-3xl font-bold text-neutral-800">Module 3: Distribution & Analytics Hub</h1>
        <p className="text-sm text-neutral-500 bg-neutral-200 px-3 py-1 rounded-full">
            Current Focus: Phase {currentPhaseId}
            {!isFocusPhase && " (Distribution Hub relevant for Phases 4 & 9)"}
        </p>
      </div>
      <p className="text-neutral-600">
        Handle content scheduling, distribution to various platforms, and measure performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Smart Calendar (Phase 4)">
          <p className="text-neutral-500">
            Visual content calendar populated from Content Studio. Funnel stage tagging (TOFU, MOFU, BOFU).
            (To be implemented - Requires Content Studio integration)
          </p>
        </Card>

        <Card title="Tool Integration (Phase 4)">
          <p className="text-neutral-500">
            API connections to Later/Metricool (scheduling), Shopify (sales), Google Analytics (metrics).
            Single-point scheduling within Brand Central AI.
            (Mock integrations to be implemented)
          </p>
        </Card>

        <Card title="Live Metrics Dashboard (Phase 9)" className="md:col-span-2">
          <p className="text-neutral-500">
            Expanded view of dashboard KPIs. Overlay BOFU posts with sales data. Auto-calculated ratios (Saves/Impressions, ROI).
            (Mock dashboard to be implemented)
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DistributionHubModule;
