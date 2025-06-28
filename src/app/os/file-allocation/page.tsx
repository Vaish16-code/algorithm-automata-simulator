"use client";

import React, { useState } from "react";
import { FileText, Play, RotateCcw, Plus, Trash2, Info, HardDrive } from "lucide-react";

interface FileBlock {
  id: number;
  allocated: boolean;
  fileId?: string;
  next?: number; // For linked allocation
}

interface IndexEntry {
  blockNumber: number;
}

interface FileEntry {
  name: string;
  size: number;
  startBlock?: number; // For contiguous
  blocks?: number[]; // For indexed
  firstBlock?: number; // For linked
}

interface AllocationResult {
  method: string;
  file: FileEntry;
  success: boolean;
  blocksUsed: number[];
  fragmentation: number;
  accessTime: number;
  message: string;
}

export default function FileAllocationPage() {
  const [diskSize, setDiskSize] = useState(20);
  const [diskBlocks, setDiskBlocks] = useState<FileBlock[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([
    { name: "file1.txt", size: 3 },
    { name: "file2.exe", size: 5 },
    { name: "file3.dat", size: 2 },
    { name: "file4.log", size: 4 }
  ]);
  
  const [allocationMethod, setAllocationMethod] = useState<string>("contiguous");
  const [results, setResults] = useState<AllocationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const allocationMethods = [
    {
      value: "contiguous",
      label: "Contiguous Allocation",
      description: "Files stored in consecutive disk blocks",
      advantages: ["Fast sequential access", "Simple directory structure", "Minimal seek time"],
      disadvantages: ["External fragmentation", "File size must be known", "Difficult to grow files"]
    },
    {
      value: "linked",
      label: "Linked Allocation",
      description: "Files stored as linked list of blocks",
      advantages: ["No external fragmentation", "Dynamic file size", "Efficient disk utilization"],
      disadvantages: ["Poor random access", "Overhead for pointers", "Reliability issues"]
    },
    {
      value: "indexed",
      label: "Indexed Allocation",
      description: "Files use index block containing pointers",
      advantages: ["Good random access", "No external fragmentation", "Dynamic file size"],
      disadvantages: ["Index block overhead", "Wasted space for small files", "Multiple levels for large files"]
    }
  ];

  // Initialize disk blocks
  React.useEffect(() => {
    const blocks: FileBlock[] = [];
    for (let i = 0; i < diskSize; i++) {
      blocks.push({ id: i, allocated: false });
    }
    setDiskBlocks(blocks);
  }, [diskSize]);

  const addFile = () => {
    setFiles([...files, { name: `file${files.length + 1}.txt`, size: 1 }]);
  };

  const removeFile = (index: number) => {
    if (files.length > 1) {
      setFiles(files.filter((_, i) => i !== index));
    }
  };

  const updateFile = (index: number, field: keyof FileEntry, value: string | number) => {
    const updated = [...files];
    updated[index] = { ...updated[index], [field]: value };
    setFiles(updated);
  };

  const contiguousAllocation = (file: FileEntry, blocks: FileBlock[]): AllocationResult => {
    // Find contiguous free blocks
    for (let i = 0; i <= blocks.length - file.size; i++) {
      let canAllocate = true;
      for (let j = i; j < i + file.size; j++) {
        if (blocks[j].allocated) {
          canAllocate = false;
          break;
        }
      }
      
      if (canAllocate) {
        const blocksUsed: number[] = [];
        for (let j = i; j < i + file.size; j++) {
          blocks[j].allocated = true;
          blocks[j].fileId = file.name;
          blocksUsed.push(j);
        }
        
        return {
          method: "Contiguous",
          file: { ...file, startBlock: i },
          success: true,
          blocksUsed,
          fragmentation: 0, // No internal fragmentation
          accessTime: 1, // Single seek
          message: `File allocated at blocks ${i}-${i + file.size - 1}`
        };
      }
    }
    
    return {
      method: "Contiguous",
      file,
      success: false,
      blocksUsed: [],
      fragmentation: 0,
      accessTime: 0,
      message: "No contiguous space available"
    };
  };

  const linkedAllocation = (file: FileEntry, blocks: FileBlock[]): AllocationResult => {
    const freeBlocks = blocks.map((block, index) => ({ block, index }))
                           .filter(({ block }) => !block.allocated)
                           .slice(0, file.size);
    
    if (freeBlocks.length < file.size) {
      return {
        method: "Linked",
        file,
        success: false,
        blocksUsed: [],
        fragmentation: 0,
        accessTime: 0,
        message: "Insufficient free blocks"
      };
    }
    
    const blocksUsed: number[] = [];
    let firstBlock: number | undefined;
    
    for (let i = 0; i < freeBlocks.length; i++) {
      const blockIndex = freeBlocks[i].index;
      blocks[blockIndex].allocated = true;
      blocks[blockIndex].fileId = file.name;
      blocksUsed.push(blockIndex);
      
      if (i === 0) {
        firstBlock = blockIndex;
      } else {
        blocks[freeBlocks[i - 1].index].next = blockIndex;
      }
    }
    
    return {
      method: "Linked",
      file: { ...file, firstBlock },
      success: true,
      blocksUsed,
      fragmentation: 0,
      accessTime: file.size, // Must traverse all blocks for random access
      message: `File allocated starting at block ${firstBlock}`
    };
  };

  const indexedAllocation = (file: FileEntry, blocks: FileBlock[]): AllocationResult => {
    const freeBlocks = blocks.map((block, index) => ({ block, index }))
                           .filter(({ block }) => !block.allocated);
    
    // Need one extra block for index
    if (freeBlocks.length < file.size + 1) {
      return {
        method: "Indexed",
        file,
        success: false,
        blocksUsed: [],
        fragmentation: 0,
        accessTime: 0,
        message: "Insufficient free blocks (including index block)"
      };
    }
    
    const indexBlock = freeBlocks[0].index;
    const dataBlocks = freeBlocks.slice(1, file.size + 1);
    const blocksUsed: number[] = [indexBlock];
    
    // Allocate index block
    blocks[indexBlock].allocated = true;
    blocks[indexBlock].fileId = `${file.name} (index)`;
    
    // Allocate data blocks
    const fileBlocks: number[] = [];
    for (const { index } of dataBlocks) {
      blocks[index].allocated = true;
      blocks[index].fileId = file.name;
      blocksUsed.push(index);
      fileBlocks.push(index);
    }
    
    return {
      method: "Indexed",
      file: { ...file, blocks: fileBlocks },
      success: true,
      blocksUsed,
      fragmentation: 1, // Index block overhead
      accessTime: 2, // Index access + data access
      message: `File allocated with index block ${indexBlock}`
    };
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setResults([]);

    // Reset disk blocks
    const resetBlocks = diskBlocks.map(block => ({ 
      ...block, 
      allocated: false, 
      fileId: undefined, 
      next: undefined 
    }));
    setDiskBlocks(resetBlocks);

    let currentBlocks = [...resetBlocks];
    const simulationResults: AllocationResult[] = [];

    const processFiles = (fileIndex: number) => {
      if (fileIndex >= files.length) {
        setIsSimulating(false);
        return;
      }

      setTimeout(() => {
        const file = files[fileIndex];
        let result: AllocationResult;

        switch (allocationMethod) {
          case "contiguous":
            result = contiguousAllocation(file, currentBlocks);
            break;
          case "linked":
            result = linkedAllocation(file, currentBlocks);
            break;
          case "indexed":
            result = indexedAllocation(file, currentBlocks);
            break;
          default:
            result = contiguousAllocation(file, currentBlocks);
        }

        simulationResults.push(result);
        setResults([...simulationResults]);
        setDiskBlocks([...currentBlocks]);

        processFiles(fileIndex + 1);
      }, 1500);
    };

    processFiles(0);
  };

  const resetSimulation = () => {
    setResults([]);
    const resetBlocks = diskBlocks.map(block => ({ 
      ...block, 
      allocated: false, 
      fileId: undefined, 
      next: undefined 
    }));
    setDiskBlocks(resetBlocks);
  };

  const getBlockColor = (block: FileBlock) => {
    if (!block.allocated) return "bg-gray-200";
    
    if (block.fileId?.includes("(index)")) return "bg-purple-500";
    
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500"];
    const fileIndex = files.findIndex(f => f.name === block.fileId);
    return colors[fileIndex % colors.length] || "bg-gray-500";
  };

  const getTotalBlocks = () => diskBlocks.length;
  const getAllocatedBlocks = () => diskBlocks.filter(b => b.allocated).length;
  const getFreeBlocks = () => getTotalBlocks() - getAllocatedBlocks();
  const getUtilization = () => getTotalBlocks() > 0 ? (getAllocatedBlocks() / getTotalBlocks() * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-green-300 text-sm font-medium mb-4">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              File Allocation Methods
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Interactive simulation of file allocation strategies including contiguous, 
              linked, and indexed allocation methods.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Method Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Allocation Method
              </h3>
              
              <div className="space-y-3">
                {allocationMethods.map((method) => (
                  <label key={method.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value={method.value}
                      checked={allocationMethod === method.value}
                      onChange={(e) => setAllocationMethod(e.target.value)}
                      className="mt-1 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{method.label}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Disk Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Disk Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disk Size (blocks)
                </label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={diskSize}
                  onChange={(e) => setDiskSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* File List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Files to Allocate</h3>
                <button
                  onClick={addFile}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add File
                </button>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-center">
                    <input
                      type="text"
                      value={file.name}
                      onChange={(e) => updateFile(index, "name", e.target.value)}
                      className="col-span-2 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="Filename"
                    />
                    <input
                      type="number"
                      value={file.size}
                      onChange={(e) => updateFile(index, "size", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="Size"
                      min="1"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 flex justify-center"
                      disabled={files.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-600 font-medium">
                <div className="col-span-2 text-center">Filename</div>
                <div className="text-center">Size</div>
                <div className="text-center">Action</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={runSimulation}
                disabled={isSimulating || files.length === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Disk Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <HardDrive className="h-5 w-5 mr-2 text-green-600" />
                Disk Layout
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-10 gap-1">
                  {diskBlocks.map((block, index) => (
                    <div
                      key={index}
                      className={`${getBlockColor(block)} border border-gray-300 text-white text-xs p-2 text-center font-medium min-h-[40px] flex flex-col justify-center`}
                    >
                      <div>{index}</div>
                      {block.allocated && (
                        <div className="text-yellow-200 text-[10px] truncate">
                          {block.fileId?.replace(/\.(txt|exe|dat|log)/, "").substring(0, 4)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Disk Statistics */}
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800">Total Blocks</div>
                    <div className="text-blue-600">{getTotalBlocks()}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800">Allocated</div>
                    <div className="text-green-600">{getAllocatedBlocks()}</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="font-semibold text-orange-800">Free</div>
                    <div className="text-orange-600">{getFreeBlocks()}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-semibold text-purple-800">Utilization</div>
                    <div className="text-purple-600">{getUtilization()}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Allocation Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Allocation Results</h3>
                
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {result.file.name} ({result.file.size} blocks)
                          </div>
                          <div className={`text-sm ${
                            result.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.message}
                          </div>
                          {result.success && (
                            <div className="text-xs text-gray-600 mt-1">
                              Blocks used: [{result.blocksUsed.join(", ")}]
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-gray-600">Method: {result.method}</div>
                          <div className="text-gray-600">Access Time: {result.accessTime} seeks</div>
                          {result.fragmentation > 0 && (
                            <div className="text-gray-600">Overhead: {result.fragmentation} blocks</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && !isSimulating && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Simulate</h3>
                <p className="text-gray-500">
                  Configure your disk size and file list, then click "Run Simulation" to see the file allocation process.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Method Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-green-600" />
            File Allocation Method Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Current Method: {allocationMethods.find(m => m.value === allocationMethod)?.label}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {allocationMethods.find(m => m.value === allocationMethod)?.description}
              </p>
              
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-2">Advantages:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                  {allocationMethods.find(m => m.value === allocationMethod)?.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
                
                <div className="font-medium text-gray-700 mb-2">Disadvantages:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {allocationMethods.find(m => m.value === allocationMethod)?.disadvantages.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mumbai University Exam Tips</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Draw disk layout diagrams for each method</li>
                <li>Show file allocation tables (FAT) for linked allocation</li>
                <li>Explain directory structure for each method</li>
                <li>Calculate access time for random vs sequential access</li>
                <li>Compare space utilization and fragmentation</li>
                <li>Discuss real-world file system implementations</li>
              </ul>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800 text-sm">Key Concepts:</div>
                <div className="text-green-700 text-xs mt-1 space-y-1">
                  <div>• Directory Entry: Contains file metadata and allocation info</div>
                  <div>• File Allocation Table (FAT): Used in linked allocation</div>
                  <div>• Index Block: Contains pointers to data blocks</div>
                  <div>• Fragmentation: Internal (within blocks) vs External (between files)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
