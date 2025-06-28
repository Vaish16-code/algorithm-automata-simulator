"use client";

import { useState } from "react";
import { Plus, Trash2, Play, RotateCcw, HardDrive, BarChart3, TrendingUp } from "lucide-react";
import { MemoryBlock, AllocationRequest, firstFit, bestFit, worstFit } from "../../utils/operatingSystems";

interface Algorithm {
  name: string;
  key: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

const algorithms: Algorithm[] = [
  {
    name: "First Fit",
    key: "first",
    description: "Allocates the first available block that is large enough",
    advantages: ["Fast allocation", "Simple implementation", "Low overhead"],
    disadvantages: ["High external fragmentation", "Doesn't optimize space usage"]
  },
  {
    name: "Best Fit",
    key: "best",
    description: "Allocates the smallest available block that is large enough",
    advantages: ["Better memory utilization", "Reduces waste"],
    disadvantages: ["Slower allocation", "Creates small unusable fragments"]
  },
  {
    name: "Worst Fit",
    key: "worst",
    description: "Allocates the largest available block",
    advantages: ["Leaves larger fragments", "Better for variable-sized allocations"],
    disadvantages: ["Poor memory utilization", "High external fragmentation"]
  }
];

export default function MemoryAllocationPage() {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([
    { id: "B1", size: 100, allocated: false, startAddress: 0 },
    { id: "B2", size: 500, allocated: false, startAddress: 100 },
    { id: "B3", size: 200, allocated: false, startAddress: 600 },
    { id: "B4", size: 300, allocated: false, startAddress: 800 },
    { id: "B5", size: 600, allocated: false, startAddress: 1100 }
  ]);

  const [allocationRequests, setAllocationRequests] = useState<AllocationRequest[]>([
    { processId: "P1", size: 212 },
    { processId: "P2", size: 417 },
    { processId: "P3", size: 112 },
    { processId: "P4", size: 426 }
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("first");
  const [allocationHistory, setAllocationHistory] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const addMemoryBlock = () => {
    const lastBlock = memoryBlocks[memoryBlocks.length - 1];
    const startAddress = lastBlock ? lastBlock.startAddress + lastBlock.size : 0;
    setMemoryBlocks([...memoryBlocks, {
      id: `B${memoryBlocks.length + 1}`,
      size: 100,
      allocated: false,
      startAddress
    }]);
  };

  const updateMemoryBlock = (index: number, field: keyof MemoryBlock, value: string | number | boolean) => {
    const updatedBlocks = [...memoryBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    
    // Recalculate start addresses
    if (field === 'size') {
      for (let i = 1; i < updatedBlocks.length; i++) {
        updatedBlocks[i].startAddress = updatedBlocks[i - 1].startAddress + updatedBlocks[i - 1].size;
      }
    }
    
    setMemoryBlocks(updatedBlocks);
  };

  const removeMemoryBlock = (index: number) => {
    const updatedBlocks = memoryBlocks.filter((_, i) => i !== index);
    // Recalculate start addresses
    for (let i = 1; i < updatedBlocks.length; i++) {
      updatedBlocks[i].startAddress = updatedBlocks[i - 1].startAddress + updatedBlocks[i - 1].size;
    }
    setMemoryBlocks(updatedBlocks);
  };

  const addAllocationRequest = () => {
    setAllocationRequests([...allocationRequests, {
      processId: `P${allocationRequests.length + 1}`,
      size: 100
    }]);
  };

  const updateAllocationRequest = (index: number, field: keyof AllocationRequest, value: string | number) => {
    const updatedRequests = [...allocationRequests];
    updatedRequests[index] = { ...updatedRequests[index], [field]: value };
    setAllocationRequests(updatedRequests);
  };

  const removeAllocationRequest = (index: number) => {
    setAllocationRequests(allocationRequests.filter((_, i) => i !== index));
  };

  const runAllocation = async () => {
    setIsSimulating(true);
    setAllocationHistory([]);
    setCurrentStep(0);

    let currentBlocks: MemoryBlock[] = memoryBlocks.map(block => ({ ...block, allocated: false, processId: undefined }));
    const history: any[] = [];

    for (let i = 0; i < allocationRequests.length; i++) {
      const request = allocationRequests[i];
      let result;

      switch (selectedAlgorithm) {
        case "first":
          result = firstFit(currentBlocks, request);
          break;
        case "best":
          result = bestFit(currentBlocks, request);
          break;
        case "worst":
          result = worstFit(currentBlocks, request);
          break;
        default:
          result = firstFit(currentBlocks, request);
      }

      history.push({
        step: i + 1,
        request,
        result,
        blocks: result.blocks.map(b => ({ ...b }))
      });

      currentBlocks = result.blocks;
      
      // Simulate delay for better visualization
      await new Promise(resolve => setTimeout(resolve, 300));
      setAllocationHistory([...history]);
      setCurrentStep(i + 1);
    }

    setIsSimulating(false);
  };

  const reset = () => {
    setAllocationHistory([]);
    setCurrentStep(0);
    setMemoryBlocks([
      { id: "B1", size: 100, allocated: false, startAddress: 0 },
      { id: "B2", size: 500, allocated: false, startAddress: 100 },
      { id: "B3", size: 200, allocated: false, startAddress: 600 },
      { id: "B4", size: 300, allocated: false, startAddress: 800 },
      { id: "B5", size: 600, allocated: false, startAddress: 1100 }
    ]);
  };

  const selectedAlgInfo = algorithms.find(alg => alg.key === selectedAlgorithm);
  const totalMemory = memoryBlocks.reduce((sum, block) => sum + block.size, 0);
  const currentBlocks: MemoryBlock[] = allocationHistory.length > 0 && currentStep > 0 
    ? allocationHistory[currentStep - 1].blocks 
    : memoryBlocks;

  const allocatedMemory = currentBlocks.filter((b: MemoryBlock) => b.allocated).reduce((sum: number, block: MemoryBlock) => sum + block.size, 0);
  const freeMemory = totalMemory - allocatedMemory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Memory Allocation Algorithms</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Visualize how different memory allocation strategies work with dynamic memory management and fragmentation analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Algorithm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {algorithms.map((alg) => (
                  <button
                    key={alg.key}
                    onClick={() => setSelectedAlgorithm(alg.key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedAlgorithm === alg.key
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{alg.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alg.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Memory Blocks Configuration */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Memory Blocks</h2>
                <button
                  onClick={addMemoryBlock}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Block</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Block ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Size (KB)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Start Address</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memoryBlocks.map((block, index) => (
                      <tr key={block.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={block.id}
                            onChange={(e) => updateMemoryBlock(index, "id", e.target.value)}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            value={block.size}
                            onChange={(e) => updateMemoryBlock(index, "size", parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-600">
                          {block.startAddress}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => removeMemoryBlock(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Allocation Requests */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Allocation Requests</h2>
                <button
                  onClick={addAllocationRequest}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Request</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Process ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Size (KB)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocationRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={request.processId}
                            onChange={(e) => updateAllocationRequest(index, "processId", e.target.value)}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            min="1"
                            value={request.size}
                            onChange={(e) => updateAllocationRequest(index, "size", parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => removeAllocationRequest(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={runAllocation}
                  disabled={isSimulating || allocationRequests.length === 0}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSimulating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{isSimulating ? "Allocating..." : "Run Allocation"}</span>
                </button>

                <button
                  onClick={reset}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Algorithm Info */}
            {selectedAlgInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedAlgInfo.name}</h3>
                <p className="text-gray-600 mb-4">{selectedAlgInfo.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Advantages:</h4>
                    <ul className="space-y-1">
                      {selectedAlgInfo.advantages.map((advantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Disadvantages:</h4>
                    <ul className="space-y-1">
                      {selectedAlgInfo.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Memory Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Memory Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Memory:</span>
                  <span className="font-semibold">{totalMemory} KB</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Allocated:</span>
                  <span className="font-semibold text-green-600">{allocatedMemory} KB</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Free:</span>
                  <span className="font-semibold text-blue-600">{freeMemory} KB</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Utilization:</span>
                  <span className="font-semibold text-purple-600">
                    {totalMemory > 0 ? ((allocatedMemory / totalMemory) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              {/* Memory visualization bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${totalMemory > 0 ? (allocatedMemory / totalMemory) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Mumbai University Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Draw memory layout diagrams</li>
                <li>• Calculate fragmentation percentages</li>
                <li>• Compare algorithm efficiency</li>
                <li>• Show step-by-step allocation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Memory Visualization */}
        {(allocationHistory.length > 0 || currentBlocks.some((b: MemoryBlock) => b.allocated)) && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Memory Layout</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {currentBlocks.map((block: MemoryBlock, index: number) => (
                  <div
                    key={block.id}
                    className={`border-2 rounded p-2 text-center min-w-0 ${
                      block.allocated 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-gray-100 border-gray-300'
                    }`}
                    style={{ 
                      width: `${Math.max(60, (block.size / totalMemory) * 400)}px`,
                      minHeight: '60px'
                    }}
                  >
                    <div className="text-xs font-semibold">{block.id}</div>
                    <div className="text-xs">{block.size} KB</div>
                    {block.allocated && (
                      <div className="text-xs text-green-700 font-semibold">
                        {block.processId}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                  <span>Allocated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span>Free</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Allocation History */}
        {allocationHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Allocation History</h2>
            
            <div className="space-y-4">
              {allocationHistory.map((entry, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Step {entry.step}: {entry.request.processId} requests {entry.request.size} KB
                    </h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      entry.result.allocated 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.result.allocated ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  {entry.result.allocated && entry.result.allocatedBlock && (
                    <p className="text-sm text-gray-600">
                      Allocated to block {entry.result.allocatedBlock.id} 
                      (Internal fragmentation: {entry.result.internalFragmentation} KB)
                    </p>
                  )}
                  
                  {!entry.result.allocated && (
                    <p className="text-sm text-red-600">
                      No suitable block found for allocation
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
