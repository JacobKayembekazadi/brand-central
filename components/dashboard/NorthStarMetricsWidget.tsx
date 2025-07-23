
import React, { useState } from 'react';
import { NorthStarMetricData } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface NorthStarMetricsWidgetProps {
  metric: NorthStarMetricData;
  onUpdate?: (metric: NorthStarMetricData) => void;
  onDelete?: (id: string) => void;
  showControls?: boolean;
}

const NorthStarMetricsWidget: React.FC<NorthStarMetricsWidgetProps> = ({ 
  metric, 
  onUpdate, 
  onDelete, 
  showControls = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(metric.value);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...metric, value: editValue });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(metric.value);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete the "${metric.name}" metric?`)) {
      onDelete(metric.id);
    }
  };

  return (
    <Card className={`text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 ${showControls ? 'border-blue-200' : ''}`}>
      <div className="p-2 flex flex-col items-center relative">
        {/* Control buttons when in edit mode */}
        {showControls && !isEditing && (
          <div className="absolute top-1 right-1 flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Edit metric"
              aria-label="Edit metric"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Delete metric"
              aria-label="Delete metric"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        )}

        <div className="text-primary mb-3 text-3xl">
          {metric.icon}
        </div>
        
        <h4 className="text-lg font-semibold text-neutral-700 mb-1">{metric.name}</h4>
        
        {isEditing ? (
          <div className="w-full space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-center text-lg font-bold"
              placeholder="Enter metric value"
              aria-label={`Edit ${metric.name} value`}
            />
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
              >
                Save
              </Button>
              <Button 
                onClick={handleCancel} 
                className="bg-neutral-500 hover:bg-neutral-600 text-xs px-3 py-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-3xl font-bold text-neutral-800">{metric.value}</p>
        )}

        {/* Status indicator when in control mode */}
        {showControls && !isEditing && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Click to edit
          </div>
        )}
      </div>
    </Card>
  );
};

export default NorthStarMetricsWidget;
    