"use client";

import React, { useState } from "react";
import { Monitor, Play, RotateCcw, Plus, Trash2, Info, HardDrive } from "lucide-react";

interface PageTableEntry {
  pageNumber: number;
  frameNumber: number | null;
  valid: boolean;
  dirty: boolean;
  referenced: boolean;
}

interface VirtualMemoryResult {
  step: number;
  logicalAddress: number;
  pageNumber: number;
  offset: number;
  physicalAddress: number | null;
  pageFault: boolean;
  pageTable: PageTableEntry[];
  memory: (number | null)[];
}

export default function VirtualMemoryPage() {
  const [pageSize, setPageSize] = useState(1024);
  const [numPages, setNumPages] = useState(8);
  const [numFrames, setNumFrames] = useState(4);
  const [logicalAddresses, setLogicalAddresses] = useState<number[]>([
    1024, 2048, 0, 3072, 1536, 4096, 2560, 0
  ]);
  
  const [pageTable, setPageTable] = useState<PageTableEntry[]>([]);
  const [physicalMemory, setPhysicalMemory] = useState<(number | null)[]>([]);
  const [results, setResults] = useState<VirtualMemoryResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize page table and physical memory
  React.useEffect(() => {
    const initialPageTable: PageTableEntry[] = [];
    for (let i = 0; i < numPages; i++) {
      initialPageTable.push({
        pageNumber: i,
        frameNumber: null,
        valid: false,
        dirty: false,
        referenced: false
      });
    }
    setPageTable(initialPageTable);
    setPhysicalMemory(new Array(numFrames).fill(null));
  }, [numPages, numFrames]);

  const addLogicalAddress = () => {
    setLogicalAddresses([...logicalAddresses, 0]);
  };

  const removeLogicalAddress = (index: number) => {
    if (logicalAddresses.length > 1) {
      setLogicalAddresses(logicalAddresses.filter((_, i) => i !== index));
    }
  };

  const updateLogicalAddress = (index: number, value: number) => {
    const updated = [...logicalAddresses];
    updated[index] = value;
    setLogicalAddresses(updated);
  };

  const translateAddress = (logicalAddress: number, currentPageTable: PageTableEntry[], currentMemory: (number | null)[]) => {
    const pageNumber = Math.floor(logicalAddress / pageSize);
    const offset = logicalAddress % pageSize;
    
    if (pageNumber >= numPages) {
      return {
        pageNumber,
        offset,
        physicalAddress: null,
        pageFault: true,
        pageTable: currentPageTable,
        memory: currentMemory
      };
    }

    const pageEntry = currentPageTable[pageNumber];
    
    if (!pageEntry.valid || pageEntry.frameNumber === null) {
      // Page fault - need to load page into memory
      let frameToUse = currentMemory.findIndex(frame => frame === null);
      
      if (frameToUse === -1) {
        // No free frames - use FIFO replacement
        frameToUse = 0;
        // Find the page that was using this frame and invalidate it
        for (let i = 0; i < currentPageTable.length; i++) {
          if (currentPageTable[i].frameNumber === frameToUse) {
            currentPageTable[i].valid = false;
            currentPageTable[i].frameNumber = null;
            break;
          }
        }
      }
      
      // Load page into frame
      currentMemory[frameToUse] = pageNumber;
      pageEntry.frameNumber = frameToUse;
      pageEntry.valid = true;
      pageEntry.referenced = true;
      
      const physicalAddress = frameToUse * pageSize + offset;
      
      return {
        pageNumber,
        offset,
        physicalAddress,
        pageFault: true,
        pageTable: [...currentPageTable],
        memory: [...currentMemory]
      };
    } else {
      // Page hit
      pageEntry.referenced = true;
      const physicalAddress = pageEntry.frameNumber * pageSize + offset;
      
      return {
        pageNumber,
        offset,
        physicalAddress,
        pageFault: false,
        pageTable: [...currentPageTable],
        memory: [...currentMemory]
      };
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setResults([]);

    // Reset page table and memory
    const initialPageTable: PageTableEntry[] = [];
    for (let i = 0; i < numPages; i++) {
      initialPageTable.push({
        pageNumber: i,
        frameNumber: null,
        valid: false,
        dirty: false,
        referenced: false
      });
    }
    
    let currentPageTable = initialPageTable;
    let currentMemory: (number | null)[] = new Array(numFrames).fill(null);
    const simulationResults: VirtualMemoryResult[] = [];

    const processAddresses = (stepIndex: number) => {
      if (stepIndex >= logicalAddresses.length) {
        setIsSimulating(false);
        return;
      }

      setTimeout(() => {
        const logicalAddress = logicalAddresses[stepIndex];
        const translation = translateAddress(logicalAddress, currentPageTable, currentMemory);
        
        currentPageTable = translation.pageTable;
        currentMemory = translation.memory;
        
        const result: VirtualMemoryResult = {
          step: stepIndex + 1,
          logicalAddress,
          pageNumber: translation.pageNumber,
          offset: translation.offset,
          physicalAddress: translation.physicalAddress,
          pageFault: translation.pageFault,
          pageTable: [...currentPageTable],
          memory: [...currentMemory]
        };
        
        simulationResults.push(result);
        setResults([...simulationResults]);
        
        processAddresses(stepIndex + 1);
      }, 1500);
    };

    processAddresses(0);
  };

  const resetSimulation = () => {
    setResults([]);
    const initialPageTable: PageTableEntry[] = [];
    for (let i = 0; i < numPages; i++) {
      initialPageTable.push({
        pageNumber: i,
        frameNumber: null,
        valid: false,
        dirty: false,
        referenced: false
      });
    }
    setPageTable(initialPageTable);
    setPhysicalMemory(new Array(numFrames).fill(null));
  };

  const getPageFaults = () => results.filter(r => r.pageFault).length;
  const getPageHits = () => results.filter(r => !r.pageFault).length;
  const getHitRatio = () => results.length > 0 ? (getPageHits() / results.length * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-300 text-sm font-medium mb-4">
              <Monitor className="h-4 w-4 mr-2" />
              Memory Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Virtual Memory Simulation
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Interactive simulation of virtual memory address translation with page tables 
              and physical memory management.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Memory Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <HardDrive className="h-5 w-5 mr-2 text-indigo-600" />
                Memory Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Size (bytes)
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={512}>512 bytes</option>
                    <option value={1024}>1024 bytes (1 KB)</option>
                    <option value={2048}>2048 bytes (2 KB)</option>
                    <option value={4096}>4096 bytes (4 KB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="16"
                    value={numPages}
                    onChange={(e) => setNumPages(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Physical Frames
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={numFrames}
                    onChange={(e) => setNumFrames(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Logical Addresses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Logical Addresses</h3>
                <button
                  onClick={addLogicalAddress}
                  className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Address
                </button>
              </div>

              <div className="space-y-3">
                {logicalAddresses.map((address, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-sm text-gray-600 text-center">#{index + 1}</div>
                    <input
                      type="number"
                      value={address}
                      onChange={(e) => updateLogicalAddress(index, Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      min="0"
                      max={numPages * pageSize - 1}
                    />
                    <button
                      onClick={() => removeLogicalAddress(index)}
                      className="text-red-600 hover:text-red-800 flex justify-center"
                      disabled={logicalAddresses.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600 font-medium">
                <div className="text-center">Step</div>
                <div className="text-center">Address</div>
                <div className="text-center">Action</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={runSimulation}
                disabled={isSimulating || logicalAddresses.length === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSimulating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Simulation
                  </>
                )}
              </button>

              <button
                onClick={resetSimulation}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Page Table</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referenced</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pageTable.map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.pageNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.frameNumber !== null ? entry.frameNumber : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.valid ? 'Valid' : 'Invalid'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.referenced ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.referenced ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Physical Memory */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Memory Frames</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {physicalMemory.map((pageNum, frameIndex) => (
                  <div
                    key={frameIndex}
                    className={`p-4 rounded-lg border-2 text-center ${
                      pageNum !== null 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-600">Frame {frameIndex}</div>
                    <div className={`text-lg font-bold ${
                      pageNum !== null ? 'text-indigo-800' : 'text-gray-400'
                    }`}>
                      {pageNum !== null ? `Page ${pageNum}` : 'Empty'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Translation Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Translation Results</h3>
                
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.pageFault ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold text-gray-800">
                            Step {result.step}: Address {result.logicalAddress}
                          </div>
                          <div className="text-sm text-gray-600">
                            Page: {result.pageNumber}, Offset: {result.offset}
                          </div>
                          <div className={`text-sm font-medium ${
                            result.pageFault ? 'text-red-700' : 'text-green-700'
                          }`}>
                            {result.pageFault ? '❌ Page Fault' : '✅ Page Hit'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">
                            Physical Address: {result.physicalAddress !== null ? result.physicalAddress : 'N/A'}
                          </div>
                          {result.physicalAddress !== null && (
                            <div className="text-sm text-gray-600">
                              Frame: {Math.floor(result.physicalAddress / pageSize)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-semibold text-red-800">Page Faults</div>
                    <div className="text-red-600 text-xl">{getPageFaults()}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800">Page Hits</div>
                    <div className="text-green-600 text-xl">{getPageHits()}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800">Hit Ratio</div>
                    <div className="text-blue-600 text-xl">{getHitRatio()}%</div>
                  </div>
                </div>
              </div>
            )}

            {results.length === 0 && !isSimulating && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Monitor className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Simulate</h3>
                <p className="text-gray-500">
                  Configure your virtual memory settings and logical addresses, then click "Run Simulation" to see the address translation process.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-indigo-600" />
            Virtual Memory Concepts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Concepts</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li><strong>Logical Address:</strong> Address generated by the CPU</li>
                <li><strong>Physical Address:</strong> Actual memory location</li>
                <li><strong>Page:</strong> Fixed-size block of logical memory</li>
                <li><strong>Frame:</strong> Fixed-size block of physical memory</li>
                <li><strong>Page Table:</strong> Maps logical pages to physical frames</li>
                <li><strong>Page Fault:</strong> Occurs when accessed page is not in memory</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mumbai University Exam Tips</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Show address translation step by step</li>
                <li>Calculate page number = logical address / page size</li>
                <li>Calculate offset = logical address % page size</li>
                <li>Draw page table and memory layout diagrams</li>
                <li>Calculate page fault rate and hit ratio</li>
                <li>Explain advantages of virtual memory</li>
              </ul>
              
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <div className="font-medium text-indigo-800 text-sm">Formula Reminder:</div>
                <div className="text-indigo-700 text-xs mt-1 space-y-1">
                  <div>Page Number = Logical Address ÷ Page Size</div>
                  <div>Offset = Logical Address MOD Page Size</div>
                  <div>Physical Address = Frame Number × Page Size + Offset</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
