
import React, { useState } from 'react';
import { ActivityItem } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  onUpdateActivity?: (activity: ActivityItem) => void;
  onDeleteActivity?: (id: string) => void;
  showControls?: boolean;
}

const ActivityIcon: React.FC<{ type: ActivityItem['type'] }> = ({ type }) => {
  switch (type) {
    case 'Asset Created':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
    case 'Post Scheduled':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z" /></svg>;
    case 'Performance Alert':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
    case 'Phase Advanced':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>;
    case 'AI Task':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-7.5h12.5" /></svg>;
    case 'Error':
        return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
  }
};

// Activity Item Edit Component
const ActivityEditItem: React.FC<{
  activity: ActivityItem;
  onUpdate: (activity: ActivityItem) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}> = ({ activity, onUpdate, onDelete, onCancel }) => {
  const [description, setDescription] = useState(activity.description);
  const [type, setType] = useState(activity.type);

  const handleSave = () => {
    onUpdate({ ...activity, description, type });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      onDelete(activity.id);
    }
  };

  const activityTypes: ActivityItem['type'][] = [
    'Asset Created', 'Post Scheduled', 'Performance Alert', 'Phase Advanced', 
    'AI Task', 'Brand Check', 'Data Loaded', 'Data Saved', 'Error'
  ];

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
      <div>
        <label htmlFor={`activity-desc-${activity.id}`} className="block text-xs font-medium text-neutral-700 mb-1">
          Description
        </label>
        <textarea
          id={`activity-desc-${activity.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-neutral-300 rounded text-sm"
          rows={2}
          placeholder="Activity description"
        />
      </div>
      <div>
        <label htmlFor={`activity-type-${activity.id}`} className="block text-xs font-medium text-neutral-700 mb-1">
          Type
        </label>
        <select
          id={`activity-type-${activity.id}`}
          value={type}
          onChange={(e) => setType(e.target.value as ActivityItem['type'])}
          className="w-full p-2 border border-neutral-300 rounded text-sm"
        >
          {activityTypes.map((actType) => (
            <option key={actType} value={actType}>{actType}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-xs">
          Save
        </Button>
        <Button onClick={onCancel} className="bg-neutral-500 hover:bg-neutral-600 text-xs">
          Cancel
        </Button>
        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-xs">
          Delete
        </Button>
      </div>
    </div>
  );
};

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ 
  activities, 
  onUpdateActivity, 
  onDeleteActivity, 
  showControls = false 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ description: '', type: 'AI Task' as ActivityItem['type'] });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUpdate = (updatedActivity: ActivityItem) => {
    if (onUpdateActivity) {
      onUpdateActivity(updatedActivity);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (onDeleteActivity) {
      onDeleteActivity(id);
      setEditingId(null);
    }
  };

  const handleAddNew = () => {
    if (newActivity.description.trim() && onUpdateActivity) {
      const activity: ActivityItem = {
        id: Date.now().toString(),
        description: newActivity.description,
        type: newActivity.type,
        timestamp: new Date()
      };
      onUpdateActivity(activity);
      setNewActivity({ description: '', type: 'AI Task' });
      setShowAddForm(false);
    }
  };

  const activityTypes: ActivityItem['type'][] = [
    'Asset Created', 'Post Scheduled', 'Performance Alert', 'Phase Advanced', 
    'AI Task', 'Brand Check', 'Data Loaded', 'Data Saved', 'Error'
  ];

  return (
    <Card title="Recent Activity">
      <div className="space-y-4">
        {/* Add New Activity Form */}
        {showControls && (
          <div className="border-b border-neutral-200 pb-4">
            {showAddForm ? (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 space-y-3">
                <h5 className="font-medium text-green-800">Add New Activity</h5>
                <div>
                  <label htmlFor="new-activity-desc" className="block text-xs font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="new-activity-desc"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="w-full p-2 border border-green-300 rounded text-sm"
                    rows={2}
                    placeholder="Enter activity description"
                  />
                </div>
                <div>
                  <label htmlFor="new-activity-type" className="block text-xs font-medium text-neutral-700 mb-1">
                    Type
                  </label>
                  <select
                    id="new-activity-type"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as ActivityItem['type'] })}
                    className="w-full p-2 border border-green-300 rounded text-sm"
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-xs">
                    Add Activity
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} className="bg-neutral-500 hover:bg-neutral-600 text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="bg-green-600 hover:bg-green-700 text-sm w-full"
              >
                + Add New Activity
              </Button>
            )}
          </div>
        )}

        {activities.length === 0 ? (
          <p className="text-neutral-500">No recent activity.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {activities.slice().reverse().map((item) => (
              <li key={item.id}>
                {editingId === item.id ? (
                  <ActivityEditItem
                    activity={item}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className={`flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors ${showControls ? 'border border-neutral-200' : ''}`}>
                    <div className="flex-shrink-0 pt-0.5">
                      <ActivityIcon type={item.type} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-neutral-700">{item.description}</p>
                      <p className="text-xs text-neutral-500">
                        {item.timestamp.toLocaleTimeString()} - {item.timestamp.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">{item.type}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {item.link && (
                        <a href={item.link} className="text-xs text-primary hover:underline">View</a>
                      )}
                      {showControls && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                            title="Edit activity"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                            title="Delete activity"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default RecentActivityFeed;
