
import React from 'react';
import { NorthStarMetricData, ActivityItem, PhaseInfo, ModuleKey } from '../../types';
import PhaseNavigator from './PhaseNavigator';
import NorthStarMetricsWidget from './NorthStarMetricsWidget';
import LMAICheck from './LMAICheck';
import RecentActivityFeed from './RecentActivityFeed';
import { PHASES } from '../../constants';

interface DashboardProps {
  currentPhaseId: number;
  northStarMetrics: NorthStarMetricData[];
  recentActivity: ActivityItem[];
  onNextPhase: () => void;
  addActivity: (description: string) => void;
  isModuleLocked: (moduleKey: ModuleKey) => boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentPhaseId,
  northStarMetrics,
  recentActivity,
  onNextPhase,
  addActivity,
  isModuleLocked
}) => {
  const currentPhaseInfo = PHASES.find(p => p.id === currentPhaseId);
  const isCurrentPhaseModuleLocked = currentPhaseInfo ? isModuleLocked(currentPhaseInfo.module) : false;

  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
      <PhaseNavigator currentPhaseId={currentPhaseId} onNextStep={onNextPhase} isModuleLocked={isCurrentPhaseModuleLocked} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {northStarMetrics.map((metric) => (
          <NorthStarMetricsWidget key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <LMAICheck addActivity={(desc) => addActivity(`AI Task: ${desc}`)} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
    