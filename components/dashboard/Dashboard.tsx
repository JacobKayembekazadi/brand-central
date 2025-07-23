
import React, { useState } from 'react';
import { NorthStarMetricData, ActivityItem, PhaseInfo, ModuleKey } from '../../types';
import PhaseNavigator from './PhaseNavigator';
import NorthStarMetricsWidget from './NorthStarMetricsWidget';
import LMAICheck from './LMAICheck';
import RecentActivityFeed from './RecentActivityFeed';
import { PHASES } from '../../constants';
import Button from '../shared/Button';
import Card from '../shared/Card';

interface DashboardProps {
  currentPhaseId: number;
  northStarMetrics: NorthStarMetricData[];
  recentActivity: ActivityItem[];
  onNextPhase: () => void;
  addActivity: (description: string) => void;
  isModuleLocked: (moduleKey: ModuleKey) => boolean;
  // New CRUD props
  updateNorthStarMetrics: (metrics: NorthStarMetricData[]) => void;
  updateRecentActivity: (activities: ActivityItem[]) => void;
  setCurrentPhase: (phaseId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentPhaseId,
  northStarMetrics,
  recentActivity,
  onNextPhase,
  addActivity,
  isModuleLocked,
  updateNorthStarMetrics,
  updateRecentActivity,
  setCurrentPhase
}) => {
  const [showMetricEditor, setShowMetricEditor] = useState(false);
  const [showActivityManager, setShowActivityManager] = useState(false);
  const [showPhaseManager, setShowPhaseManager] = useState(false);

  const currentPhaseInfo = PHASES.find(p => p.id === currentPhaseId);
  const isCurrentPhaseModuleLocked = currentPhaseInfo ? isModuleLocked(currentPhaseInfo.module) : false;

  // CRUD Operations for North Star Metrics
  const handleUpdateMetric = (updatedMetric: NorthStarMetricData) => {
    const updatedMetrics = northStarMetrics.map(metric => 
      metric.id === updatedMetric.id ? updatedMetric : metric
    );
    updateNorthStarMetrics(updatedMetrics);
    addActivity(`Updated North Star Metric: ${updatedMetric.name}`);
  };

  const handleDeleteMetric = (metricId: string) => {
    const updatedMetrics = northStarMetrics.filter(metric => metric.id !== metricId);
    updateNorthStarMetrics(updatedMetrics);
    addActivity(`Deleted North Star Metric: ${metricId}`);
  };

  const handleAddMetric = (newMetric: Omit<NorthStarMetricData, 'id'>) => {
    const metric: NorthStarMetricData = {
      ...newMetric,
      id: Date.now().toString()
    };
    updateNorthStarMetrics([...northStarMetrics, metric]);
    addActivity(`Added new North Star Metric: ${metric.name}`);
  };

  // CRUD Operations for Activities
  const handleUpdateActivity = (updatedActivity: ActivityItem) => {
    const updatedActivities = recentActivity.map(activity => 
      activity.id === updatedActivity.id ? updatedActivity : activity
    );
    updateRecentActivity(updatedActivities);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = recentActivity.filter(activity => activity.id !== activityId);
    updateRecentActivity(updatedActivities);
  };

  const handleClearAllActivities = () => {
    updateRecentActivity([]);
    addActivity('Cleared all previous activities');
  };

  // Phase Management
  const handlePhaseChange = (newPhaseId: number) => {
    setCurrentPhase(newPhaseId);
    addActivity(`Manually switched to Phase ${newPhaseId}: ${PHASES.find(p => p.id === newPhaseId)?.title || ''}`);
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Actions Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Dashboard Management</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowMetricEditor(!showMetricEditor)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showMetricEditor ? 'Hide' : 'Manage'} Metrics
            </Button>
            <Button 
              onClick={() => setShowActivityManager(!showActivityManager)}
              className="bg-green-600 hover:bg-green-700"
            >
              {showActivityManager ? 'Hide' : 'Manage'} Activities
            </Button>
            <Button 
              onClick={() => setShowPhaseManager(!showPhaseManager)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {showPhaseManager ? 'Hide' : 'Manage'} Phases
            </Button>
            <Button 
              onClick={handleClearAllActivities}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear All Activities
            </Button>
          </div>
        </div>
      </Card>

      {/* Phase Manager */}
      {showPhaseManager && (
        <PhaseManager 
          currentPhaseId={currentPhaseId}
          onPhaseChange={handlePhaseChange}
          phases={PHASES}
        />
      )}

      {/* Metric Editor */}
      {showMetricEditor && (
        <MetricEditor 
          metrics={northStarMetrics}
          onUpdateMetric={handleUpdateMetric}
          onDeleteMetric={handleDeleteMetric}
          onAddMetric={handleAddMetric}
        />
      )}

      {/* Activity Manager */}
      {showActivityManager && (
        <ActivityManager 
          activities={recentActivity}
          onUpdateActivity={handleUpdateActivity}
          onDeleteActivity={handleDeleteActivity}
          onClearAll={handleClearAllActivities}
        />
      )}

      <PhaseNavigator currentPhaseId={currentPhaseId} onNextStep={onNextPhase} isModuleLocked={isCurrentPhaseModuleLocked} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {northStarMetrics.map((metric) => (
          <NorthStarMetricsWidget 
            key={metric.id} 
            metric={metric}
            onUpdate={handleUpdateMetric}
            onDelete={handleDeleteMetric}
            showControls={showMetricEditor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <LMAICheck addActivity={(desc) => addActivity(`AI Task: ${desc}`)} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed 
            activities={recentActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            showControls={showActivityManager}
          />
        </div>
      </div>
    </div>
  );
};

// Phase Manager Component
const PhaseManager: React.FC<{
  currentPhaseId: number;
  onPhaseChange: (phaseId: number) => void;
  phases: PhaseInfo[];
}> = ({ currentPhaseId, onPhaseChange, phases }) => {
  return (
    <Card title="Phase Management">
      <div className="p-4">
        <p className="text-sm text-neutral-600 mb-4">Manually navigate between brand development phases</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {phases.map((phase) => (
            <Button
              key={phase.id}
              onClick={() => onPhaseChange(phase.id)}
              className={`text-sm ${
                currentPhaseId === phase.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Phase {phase.id}: {phase.title.replace('Phase ', '').replace(/:\s.*/, '')}
            </Button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Current:</strong> {phases.find(p => p.id === currentPhaseId)?.title}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {phases.find(p => p.id === currentPhaseId)?.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Metric Editor Component
const MetricEditor: React.FC<{
  metrics: NorthStarMetricData[];
  onUpdateMetric: (metric: NorthStarMetricData) => void;
  onDeleteMetric: (id: string) => void;
  onAddMetric: (metric: Omit<NorthStarMetricData, 'id'>) => void;
}> = ({ metrics, onUpdateMetric, onDeleteMetric, onAddMetric }) => {
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');

  const handleAddNew = () => {
    if (newMetricName && newMetricValue) {
      onAddMetric({
        name: newMetricName as any,
        value: newMetricValue,
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      });
      setNewMetricName('');
      setNewMetricValue('');
    }
  };

  return (
    <Card title="North Star Metrics Editor">
      <div className="p-4 space-y-4">
        {/* Add New Metric */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Add New Metric</h4>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Metric name"
              value={newMetricName}
              onChange={(e) => setNewMetricName(e.target.value)}
              className="flex-1 p-2 border border-green-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Value (e.g., 1.2M Imp.)"
              value={newMetricValue}
              onChange={(e) => setNewMetricValue(e.target.value)}
              className="flex-1 p-2 border border-green-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
              Add
            </Button>
          </div>
        </div>

        {/* Existing Metrics */}
        <div className="space-y-3">
          {metrics.map((metric) => (
            <MetricEditRow
              key={metric.id}
              metric={metric}
              onUpdate={onUpdateMetric}
              onDelete={onDeleteMetric}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Metric Edit Row Component
const MetricEditRow: React.FC<{
  metric: NorthStarMetricData;
  onUpdate: (metric: NorthStarMetricData) => void;
  onDelete: (id: string) => void;
}> = ({ metric, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(metric.name);
  const [value, setValue] = useState(metric.value);

  const handleSave = () => {
    onUpdate({ ...metric, name: name as any, value });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(metric.name);
    setValue(metric.value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
      {isEditing ? (
        <>
                     <input
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="flex-1 p-2 border border-neutral-300 rounded-lg"
             placeholder="Metric name"
             aria-label="Edit metric name"
           />
           <input
             type="text"
             value={value}
             onChange={(e) => setValue(e.target.value)}
             className="flex-1 p-2 border border-neutral-300 rounded-lg"
             placeholder="Metric value"
             aria-label="Edit metric value"
           />
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-sm">
            Save
          </Button>
          <Button onClick={handleCancel} className="bg-neutral-500 hover:bg-neutral-600 text-sm">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1">
            <span className="font-medium">{metric.name}</span>
          </div>
          <div className="flex-1">
            <span className="text-neutral-600">{metric.value}</span>
          </div>
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-sm">
            Edit
          </Button>
          <Button onClick={() => onDelete(metric.id)} className="bg-red-600 hover:bg-red-700 text-sm">
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

// Activity Manager Component
const ActivityManager: React.FC<{
  activities: ActivityItem[];
  onUpdateActivity: (activity: ActivityItem) => void;
  onDeleteActivity: (id: string) => void;
  onClearAll: () => void;
}> = ({ activities, onUpdateActivity, onDeleteActivity, onClearAll }) => {
  return (
    <Card title="Activity Manager">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-neutral-600">Manage recent activities ({activities.length} total)</p>
          <Button onClick={onClearAll} className="bg-red-600 hover:bg-red-700 text-sm">
            Clear All
          </Button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activities.slice().reverse().map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-neutral-500">{activity.timestamp.toLocaleString()}</p>
              </div>
              <Button 
                onClick={() => onDeleteActivity(activity.id)} 
                className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;
    