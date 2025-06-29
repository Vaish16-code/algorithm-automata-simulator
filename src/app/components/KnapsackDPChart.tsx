import React from 'react';
import { KnapsackDPResult } from '../utils/dynamicProgramming';

interface KnapsackDPChartProps {
  data: KnapsackDPResult;
  capacity: number;
}

export function KnapsackDPChart({ data, capacity }: KnapsackDPChartProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Selected Items */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          ✅ Selected Items
        </h3>
        
        {data.selectedItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Item</th>
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Weight</th>
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Value</th>
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Value/Weight</th>
                </tr>
              </thead>
              <tbody>
                {data.selectedItems.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}>
                    <td className="border-2 border-gray-400 px-4 py-3 font-semibold text-gray-800">
                      Item {item.index}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-gray-700">
                      {item.weight}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-green-600 font-bold">
                      {item.value}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-blue-600 font-semibold">
                      {(item.value / item.weight).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No items selected</p>
        )}
      </div>

      {/* DP Table Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📊 Dynamic Programming Table
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-4 border-gray-800 px-4 py-3 bg-gray-900 text-white font-bold text-lg">Items\Capacity</th>
                {Array.from({ length: capacity + 1 }, (_, i) => (
                  <th key={i} className="border-4 border-gray-800 px-4 py-3 bg-gray-900 text-white font-bold text-lg">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.dpTable.map((row, i) => (
                <tr key={i}>
                  <td className="border-4 border-gray-600 px-4 py-3 bg-gray-800 text-white font-bold text-lg">
                    {i === 0 ? "0" : `Item ${i}`}
                  </td>
                  {row.map((value, j) => (
                    <td 
                      key={j} 
                      className={`border-4 border-gray-600 px-4 py-3 text-center font-bold text-lg ${
                        value > 0 ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-900'
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> Each cell dp[i][w] represents the maximum value achievable using items 1 to i with weight capacity w.</p>
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📝 Algorithm Steps
        </h3>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {data.steps.slice(0, 20).map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border border-yellow-300">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                {index + 1}
              </div>
              <div className="text-sm text-gray-700">{step}</div>
            </div>
          ))}
          {data.steps.length > 20 && (
            <div className="text-sm text-gray-500 text-center">
              ... and {data.steps.length - 20} more steps
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📈 Solution Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-green-600">{data.maxValue}</div>
            <div className="text-sm text-gray-600">Max Value</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-blue-600">{data.selectedItems.length}</div>
            <div className="text-sm text-gray-600">Items Selected</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-purple-600">
              {data.selectedItems.reduce((sum, item) => sum + item.weight, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Weight</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-orange-600">
              {capacity - data.selectedItems.reduce((sum, item) => sum + item.weight, 0)}
            </div>
            <div className="text-sm text-gray-600">Remaining Capacity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
