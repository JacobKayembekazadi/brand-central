
import React from 'react';
import { NorthStarMetricData } from '../../types';
import Card from '../shared/Card';

interface NorthStarMetricsWidgetProps {
  metric: NorthStarMetricData;
}

const NorthStarMetricsWidget: React.FC<NorthStarMetricsWidgetProps> = ({ metric }) => {
  return (
    <Card className="text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
      <div className="p-2 flex flex-col items-center">
        <div className="text-primary mb-3 text-3xl">
            {metric.icon}
        </div>
        <h4 className="text-lg font-semibold text-neutral-700 mb-1">{metric.name}</h4>
        <p className="text-3xl font-bold text-neutral-800">{metric.value}</p>
        {/* Placeholder for trend indicator */}
        {/* <p className="text-sm text-green-500 mt-1">+5% last week</p> */}
      </div>
    </Card>
  );
};

export default NorthStarMetricsWidget;
    