"use client";

import React from 'react';
import { GanttItem } from '../utils/scheduling';

interface GanttChartProps {
  ganttChart: GanttItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ ganttChart }) => {
  if (!ganttChart || ganttChart.length === 0) {
    return null;
  }

  const maxTime = Math.max(...ganttChart.map(item => item.endTime));
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];

  const getColor = (processId: string) => {
    const index = parseInt(processId.replace('P', '')) - 1;
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Gantt Chart</h3>
      
      {/* Timeline */}
      <div className="mb-4">
        <div className="flex border-b border-gray-300">
          {ganttChart.map((item, index) => (
            <div
              key={index}
              className={`${getColor(item.processId)} text-white text-center py-3 border-r border-white flex items-center justify-center font-medium`}
              style={{
                width: `${((item.endTime - item.startTime) / maxTime) * 100}%`,
                minWidth: '40px'
              }}
            >
              {item.processId}
            </div>
          ))}
        </div>
        
        {/* Time markers */}
        <div className="flex">
          {ganttChart.map((item, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 py-2 border-r border-gray-200 flex justify-between px-1"
              style={{
                width: `${((item.endTime - item.startTime) / maxTime) * 100}%`,
                minWidth: '40px'
              }}
            >
              <span>{item.startTime}</span>
              {index === ganttChart.length - 1 && <span>{item.endTime}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {Array.from(new Set(ganttChart.map(item => item.processId))).map(processId => (
          <div key={processId} className="flex items-center gap-2">
            <div className={`w-4 h-4 ${getColor(processId)} rounded`}></div>
            <span className="text-sm text-gray-700">{processId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;