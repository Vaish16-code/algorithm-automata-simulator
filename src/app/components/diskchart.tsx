import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiskChartProps {
  sequence: number[];
}

const DiskChart: React.FC<DiskChartProps> = ({ sequence }) => {
  // Convert sequence to chart data
  const chartData = sequence.map((position, index) => ({
    step: index,
    position: position,
  }));

  return (
    <div className="w-full h-96 mt-4">
      <h3 className="text-lg font-semibold mb-2">Disk Head Movement</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="step" 
            label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Track Position', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [value, 'Track Position']}
            labelFormatter={(step) => `Step: ${step}`}
          />
          <Line 
            type="monotone" 
            dataKey="position" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-sm text-gray-600">
        <p><strong>Sequence:</strong> {sequence.join(' → ')}</p>
      </div>
    </div>
  );
};

export default DiskChart;