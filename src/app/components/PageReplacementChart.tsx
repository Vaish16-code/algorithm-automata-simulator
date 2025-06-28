import React from 'react';

interface PageReplacementStep {
  page: number;
  frames: (number | null)[];
  hit: boolean;
  replacedIndex?: number;
  replacedPage?: number;
}

interface PageReplacementResult {
  algorithm: string;
  steps: PageReplacementStep[];
  pageFaults: number;
  pageHits: number;
  hitRatio: number;
}

interface PageReplacementChartProps {
  result: PageReplacementResult;
  sequence: number[];
  frameSize: number;
}

const PageReplacementChart: React.FC<PageReplacementChartProps> = ({
  result,
  sequence,
  frameSize
}) => {
  if (!result || !result.steps) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        {result.algorithm} Algorithm Visualization
      </h3>
      
      {/* Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-red-100 p-3 rounded-lg border border-red-200">
          <div className="text-sm font-semibold text-red-700">Page Faults</div>
          <div className="text-2xl font-bold text-red-800">{result.pageFaults}</div>
        </div>
        <div className="bg-green-100 p-3 rounded-lg border border-green-200">
          <div className="text-sm font-semibold text-green-700">Page Hits</div>
          <div className="text-2xl font-bold text-green-800">{result.pageHits}</div>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-semibold text-blue-700">Hit Ratio</div>
          <div className="text-2xl font-bold text-blue-800">{result.hitRatio.toFixed(2)}%</div>
        </div>
      </div>

      {/* Page Reference Sequence */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Page Reference Sequence:</h4>
        <div className="flex flex-wrap gap-2">
          {sequence.map((page, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium"
            >
              {page}
            </div>
          ))}
        </div>
      </div>

      {/* Visualization Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                Page
              </th>
              {Array.from({ length: frameSize }, (_, i) => (
                <th key={i} className="border border-gray-300 px-3 py-2 text-center font-semibold">
                  Frame {i + 1}
                </th>
              ))}
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {result.steps.map((step, index) => (
              <tr key={index} className={step.hit ? 'bg-green-50' : 'bg-red-50'}>
                <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                  {step.page}
                </td>
                {step.frames.map((frame, frameIndex) => (
                  <td
                    key={frameIndex}
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      step.replacedIndex === frameIndex && !step.hit
                        ? 'bg-red-200 font-bold'
                        : frame !== null
                        ? 'bg-gray-100'
                        : ''
                    }`}
                  >
                    {frame !== null ? frame : '-'}
                  </td>
                ))}
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.hit
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {step.hit ? 'HIT' : 'FAULT'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Page Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Page Fault</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>Replaced Frame</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageReplacementChart;