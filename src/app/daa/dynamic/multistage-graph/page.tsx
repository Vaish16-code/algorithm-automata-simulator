"use client";

import React, { useState, useEffect } from "react";
import { multistageGraphAlgorithm, MultistageGraphResult } from "@/app/utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "@/components";

interface Node {
  id: number;
  stage: number;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export default function MultistageGraphPage() {
  const [numStages, setNumStages] = useState<number>(4);
  const [nodesPerStage, setNodesPerStage] = useState<number[]>([1, 2, 2, 1]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'delete' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [result, setResult] = useState<MultistageGraphResult | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(-1);
  const [currentStage, setCurrentStage] = useState<number>(0);
  
  // New state for drag and drop
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [dragStarted, setDragStarted] = useState<boolean>(false);
  
  // New state for undo functionality
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    generateGraph();
  }, [numStages, nodesPerStage]);

  // Save state to history for undo functionality
  const saveToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...newNodes], edges: [...newEdges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
      setResult(null);
      setAnimationStep(-1);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      setResult(null);
      setAnimationStep(-1);
    }
  };

  const generateGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let nodeId = 0;
    
    // Generate nodes for each stage
    for (let stage = 0; stage < numStages; stage++) {
      const stageNodes = nodesPerStage[stage] || 1;
      const stageX = 100 + stage * 120;
      
      for (let i = 0; i < stageNodes; i++) {
        const y = 100 + (i * 200 / Math.max(stageNodes - 1, 1));
        newNodes.push({
          id: nodeId,
          stage,
          x: stageX,
          y: y,
          label: stage === 0 ? 'S' : stage === numStages - 1 ? 'T' : `${stage}-${i + 1}`
        });
        nodeId++;
      }
    }
    
    // Generate sample edges between consecutive stages
    for (let stage = 0; stage < numStages - 1; stage++) {
      const currentStageNodes = newNodes.filter(n => n.stage === stage);
      const nextStageNodes = newNodes.filter(n => n.stage === stage + 1);
      
      currentStageNodes.forEach(fromNode => {
        nextStageNodes.forEach(toNode => {
          // Add some random edges
          if (Math.random() > 0.3) {
            newEdges.push({
              from: fromNode.id,
              to: toNode.id,
              weight: Math.floor(Math.random() * 10) + 1
            });
          }
        });
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setResult(null);
    setAnimationStep(-1);
    saveToHistory(newNodes, newEdges);
  };

  // Mouse down handler for dragging
  const handleNodeMouseDown = (nodeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Node mouse down:', nodeId, 'Mode:', isDrawingMode);
    
    // Only allow dragging when not in edge mode
    if (isDrawingMode !== 'edge') {
      setIsDragging(true);
      setSelectedNode(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const svg = event.currentTarget.closest('svg');
        if (svg) {
          const rect = svg.getBoundingClientRect();
          setDragOffset({
            x: event.clientX - rect.left - node.x,
            y: event.clientY - rect.top - node.y
          });
        }
      }
      setDragStarted(false);
      event.preventDefault();
    }
  };

  // SVG mouse move handler for dragging
  const handleSvgMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || selectedNode === null) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const newX = Math.max(25, Math.min(575, event.clientX - rect.left - dragOffset.x));
    const newY = Math.max(25, Math.min(275, event.clientY - rect.top - dragOffset.y));

    if (!dragStarted) {
      setDragStarted(true);
    }

    const newNodes = nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, x: newX, y: newY }
        : node
    );
    
    setNodes(newNodes);
    event.preventDefault();
  };

  // SVG mouse up handler
  const handleSvgMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
        setSelectedNode(null);
        return;
      }
      setSelectedNode(null);
    }

    // If not dragging, handle as regular click for adding nodes/edges
    if (!dragStarted && !isDragging && isDrawingMode === 'node') {
      handleSvgClickInternal(event);
    }
  };

  // SVG mouse leave handler
  const handleSvgMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
      }
      setSelectedNode(null);
    }
  };

  // Handle node clicks directly
  const handleNodeClick = (nodeId: number, event: React.MouseEvent) => {
    console.log('=== NODE CLICK EVENT ===');
    console.log('Node clicked:', nodeId, 'Mode:', isDrawingMode, 'EdgeStart:', edgeStart);
    
    if (dragStarted) {
      console.log('⚠️ Ignoring click because drag just finished');
      return;
    }
    
    event.stopPropagation();
    
    if (isDrawingMode === 'edge') {
      console.log('🎯 In edge creation mode');
      if (edgeStart === null) {
        setEdgeStart(nodeId);
        console.log('✅ First node selected for edge:', nodeId);
      } else if (edgeStart !== nodeId) {
        const fromNode = nodes.find(n => n.id === edgeStart);
        const toNode = nodes.find(n => n.id === nodeId);
        
        // Only allow edges to next stage in multistage graph
        if (fromNode && toNode && toNode.stage === fromNode.stage + 1) {
          const weight = parseInt(edgeWeight) || 1;
          
          // Check if edge already exists
          const existingEdge = edges.find(e => 
            e.from === edgeStart && e.to === nodeId
          );
          
          if (!existingEdge) {
            const newEdge: Edge = {
              from: edgeStart,
              to: nodeId,
              weight
            };
            const newEdges = [...edges, newEdge];
            setEdges(newEdges);
            saveToHistory(nodes, newEdges);
            console.log('✅ Edge created:', edgeStart, 'to', nodeId, 'weight:', weight);
          } else {
            console.log('❌ Edge already exists from', edgeStart, 'to', nodeId);
          }
        } else {
          console.log('❌ Can only create edges to next stage');
        }
        setEdgeStart(null);
      } else {
        console.log('🔄 Same node clicked twice, canceling edge creation');
        setEdgeStart(null);
      }
    } else if (isDrawingMode === 'delete') {
      // Delete node and all connected edges
      const newNodes = nodes.filter(n => n.id !== nodeId);
      const newEdges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);
      
      // Renumber nodes to maintain sequential IDs
      const renumberedNodes = newNodes.map((node, index) => ({
        ...node,
        id: index,
        label: node.stage === 0 ? 'S' : node.stage === numStages - 1 ? 'T' : `${node.stage}-${index + 1}`
      }));
      
      // Update edge references to match renumbered nodes
      const renumberedEdges = newEdges.map(edge => {
        const fromIndex = newNodes.findIndex(n => n.id === edge.from);
        const toIndex = newNodes.findIndex(n => n.id === edge.to);
        return {
          ...edge,
          from: fromIndex,
          to: toIndex
        };
      }).filter(edge => edge.from >= 0 && edge.to >= 0);
      
      setNodes(renumberedNodes);
      setEdges(renumberedEdges);
      saveToHistory(renumberedNodes, renumberedEdges);
      if (selectedNode === nodeId) setSelectedNode(null);
      console.log('Node deleted:', nodeId);
    } else if (isDrawingMode === 'none') {
      setSelectedNode(nodeId);
      console.log('Node selected:', nodeId);
    }
  };

  // SVG click logic for adding nodes
  const handleSvgClickInternal = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawingMode === 'node') {
      // Determine which stage this node should be in based on x position
      const stageWidth = 120;
      const stageIndex = Math.floor((x - 50) / stageWidth);
      const targetStage = Math.max(0, Math.min(numStages - 1, stageIndex));
      
      // Add new node to the determined stage
      const newNode: Node = {
        id: nodes.length,
        stage: targetStage,
        x,
        y,
        label: targetStage === 0 ? 'S' : targetStage === numStages - 1 ? 'T' : `${targetStage}-${nodes.filter(n => n.stage === targetStage).length + 1}`
      };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      saveToHistory(newNodes, edges);
    } else if (isDrawingMode === 'edge') {
      // Reset edge start if clicking on empty space
      setEdgeStart(null);
    } else {
      // Select nothing if clicking on empty space
      setSelectedNode(null);
    }
  };

  const runMultistageGraph = () => {
    if (nodes.length === 0) return;

    const sourceNode = nodes.find(n => n.stage === 0)?.id || 0;
    const targetNode = nodes.find(n => n.stage === numStages - 1)?.id || nodes.length - 1;
    
    const multistageResult = multistageGraphAlgorithm(edges, nodes, sourceNode, targetNode, numStages);
    setResult(multistageResult);
    setAnimationStep(0);
  };

  const clearGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    setNodes(newNodes);
    setEdges(newEdges);
    setResult(null);
    setAnimationStep(-1);
    setSelectedNode(null);
    setEdgeStart(null);
    saveToHistory(newNodes, newEdges);
  };

  const loadSampleGraph = () => {
    const sampleNodes: Node[] = [
      { id: 0, stage: 0, x: 100, y: 150, label: 'S' },
      { id: 1, stage: 1, x: 220, y: 100, label: '1-1' },
      { id: 2, stage: 1, x: 220, y: 200, label: '1-2' },
      { id: 3, stage: 2, x: 340, y: 100, label: '2-1' },
      { id: 4, stage: 2, x: 340, y: 200, label: '2-2' },
      { id: 5, stage: 3, x: 460, y: 150, label: 'T' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 8 },
      { from: 1, to: 3, weight: 6 },
      { from: 1, to: 4, weight: 9 },
      { from: 2, to: 3, weight: 8 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 4 },
      { from: 4, to: 5, weight: 2 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setResult(null);
    setAnimationStep(-1);
    saveToHistory(sampleNodes, sampleEdges);
  };

  const updateStageConfig = (stage: number, count: number) => {
    const newNodesPerStage = [...nodesPerStage];
    newNodesPerStage[stage] = Math.max(1, count);
    setNodesPerStage(newNodesPerStage);
  };

  const nextStep = () => {
    if (result && animationStep < result.steps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Multistage Graph <span className="text-indigo-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the shortest path from source to destination in a multistage graph using dynamic programming
          </p>
        </div>

        <EducationalInfo
          topic="Multistage Graph Shortest Path Problem"
          description="A multistage graph is a directed acyclic graph organized into stages. The goal is to find the shortest path from the source (first stage) to the destination (last stage) using dynamic programming."
          theory={{
            definition: "A directed acyclic graph where vertices are organized into disjoint sets called stages, and edges only exist between consecutive stages. The objective is to find the minimum cost path from source to destination.",
            keyPoints: [
              "Graph is organized into k stages with directed edges between consecutive stages only",
              "Uses backward dynamic programming approach",
              "Optimal substructure: optimal path contains optimal subpaths",
              "More efficient than checking all possible paths"
            ],
            applications: [
              "Resource allocation in production planning",
              "Project scheduling and management",
              "Investment decision making",
              "Network routing optimization"
            ]
          }}
          university={{
            syllabus: [
              "Multistage graph problem formulation",
              "Dynamic programming solution approach",
              "Backward and forward approaches",
              "Time and space complexity analysis",
              "Applications in resource allocation"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Solve multistage graph using dynamic programming",
              "Find shortest path from source to destination",
              "Show cost and decision tables",
              "Trace back optimal path"
            ],
            examTips: [
              "Work backwards from destination to source",
              "Maintain cost[i][j] = minimum cost from stage i node j to destination",
              "Record decisions for path reconstruction",
              "Show all stages of computation clearly"
            ]
          }}
          algorithm={{
            steps: [
              "Organize graph into k stages with nodes at each stage",
              "Start from last stage: cost[k-1][j] = 0 for destination nodes",
              "Work backwards: for each stage i from k-2 to 0",
              "For each node j in stage i: cost[i][j] = min(weight[j][l] + cost[i+1][l])",
              "Record decision[i][j] = l that gives minimum cost",
              "Trace forward using decisions to get optimal path"
            ],
            complexity: {
              time: "O(V + E) where V is vertices and E is edges",
              space: "O(V) for cost and decision arrays"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graph Configuration Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Multistage Graph</h2>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stages
                </label>
                <select
                  value={numStages}
                  onChange={(e) => {
                    const stages = parseInt(e.target.value);
                    setNumStages(stages);
                    setNodesPerStage(Array(stages).fill(1));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={3}>3 Stages</option>
                  <option value={4}>4 Stages</option>
                  <option value={5}>5 Stages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nodes per Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: numStages }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">Stage {i}:</span>
                      <select
                        value={nodesPerStage[i] || 1}
                        onChange={(e) => updateStageConfig(i, parseInt(e.target.value))}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        disabled={i === 0 || i === numStages - 1} // Source and target are single nodes
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'node' ? 'none' : 'node')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'node' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Node
                </button>

                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'edge' ? 'none' : 'edge')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'edge' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Edge
                </button>

                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'delete' ? 'none' : 'delete')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'delete' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Delete
                </button>
                
                {isDrawingMode === 'edge' && (
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight"
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-lg w-20 text-center"
                  />
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={clearGraph}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear Graph
                </button>
                
                <button
                  onClick={loadSampleGraph}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Load Sample
                </button>

                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                >
                  ↶ Undo
                </button>

                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                >
                  ↷ Redo
                </button>

                <button
                  onClick={generateGraph}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Regenerate Graph
                </button>
              </div>

              <button
                onClick={runMultistageGraph}
                disabled={nodes.length === 0}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Find Shortest Path
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg bg-gray-50">
              <svg
                width={600}
                height={300}
                className={`border rounded-lg bg-gray-50 ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseLeave}
                style={{ userSelect: 'none' }}
              >
                {/* Define arrowhead markers */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6b7280"
                    />
                  </marker>
                  <marker
                    id="arrowhead-highlighted"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#22c55e"
                    />
                  </marker>
                </defs>

                {/* Draw stage lines */}
                {Array.from({ length: numStages }, (_, stage) => {
                  const x = 100 + stage * 120;
                  return (
                    <g key={`stage-${stage}`}>
                      <line
                        x1={x}
                        y1={50}
                        x2={x}
                        y2={250}
                        stroke="#e5e7eb"
                        strokeWidth={1}
                        style={{ pointerEvents: 'none' }}
                      />
                      <text
                        x={x}
                        y={40}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="12"
                        style={{ pointerEvents: 'none' }}
                      >
                        Stage {stage}
                      </text>
                    </g>
                  );
                })}

                {/* Draw edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  // Highlight edge if it's in optimal path
                  let strokeColor = '#6b7280';
                  let strokeWidth = 2;
                  let isHighlighted = false;
                  
                  if (result && result.optimalPath && animationStep >= 0) {
                    const isInPath = result.optimalPath.some((pathNodeId, pathIndex) => 
                      pathIndex < result.optimalPath.length - 1 && 
                      pathNodeId === edge.from && 
                      result.optimalPath[pathIndex + 1] === edge.to
                    );
                    
                    if (isInPath) {
                      strokeColor = '#22c55e';
                      strokeWidth = 4;
                      isHighlighted = true;
                    }
                  }

                  // Calculate arrow position
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const unitX = dx / length;
                  const unitY = dy / length;
                  
                  // Adjust end point to stop at node border (radius 20)
                  const endX = toNode.x - unitX * 20;
                  const endY = toNode.y - unitY * 20;
                  
                  return (
                    <g key={`edge-${index}`}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={endX}
                        y2={endY}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        markerEnd={isHighlighted ? 'url(#arrowhead-highlighted)' : 'url(#arrowhead)'}
                        style={{ pointerEvents: 'none' }}
                      />
                      
                      {/* Draw weight */}
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontSize="12"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                
                {/* Draw nodes */}
                {nodes.map(node => {
                  // Node colors based on stage and algorithm state
                  let fillColor = '#e5e7eb'; // Default - gray
                  
                  if (node.stage === 0) {
                    fillColor = '#ef4444'; // Source - red
                  } else if (node.stage === numStages - 1) {
                    fillColor = '#22c55e'; // Target - green
                  } else if (selectedNode === node.id) {
                    fillColor = '#3b82f6'; // Selected - blue
                  } else if (result && result.optimalPath && result.optimalPath.includes(node.id)) {
                    fillColor = '#f59e0b'; // In optimal path - orange
                  } else {
                    // Add special highlighting for drawing modes
                    if (isDrawingMode === 'edge' && edgeStart === node.id) {
                      fillColor = '#fbbf24'; // Selected for edge creation - yellow
                    }
                  }
                  
                  return (
                    <g key={`node-${node.id}`}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill={fillColor}
                        stroke="#374151"
                        strokeWidth={2}
                        style={{ cursor: 'grab' }}
                        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                        onClick={(e) => handleNodeClick(node.id, e)}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontSize="12"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.label}
                      </text>
                      
                      {/* Draw cost if algorithm is running */}
                      {result && animationStep >= 0 && result.steps[animationStep] && (
                        (() => {
                          const step = result.steps[animationStep];
                          if (step.costs && step.costs[node.id] !== undefined && step.costs[node.id] !== Infinity) {
                            return (
                              <text
                                x={node.x}
                                y={node.y - 25}
                                textAnchor="middle"
                                fill="#dc2626"
                                fontSize="10"
                                fontWeight="bold"
                                style={{ pointerEvents: 'none' }}
                              >
                                {step.costs[node.id]}
                              </text>
                            );
                          }
                          return null;
                        })()
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click &quot;Add Node&quot; then click on canvas to add vertices (nodes are assigned to stages based on position)</li>
                <li><strong>Add Edge:</strong> Click &quot;Add Edge&quot;, set weight, then click two consecutive stage nodes</li>
                <li>Only edges between consecutive stages are allowed (stage N to stage N+1)</li>
                <li>Click &quot;Delete&quot; then click nodes to remove them (can be undone)</li>
                <li>Drag nodes to move them around (not available in edge mode)</li>
                <li>Use Undo/Redo to restore accidentally deleted items</li>
                <li>Configure stages and nodes per stage using the dropdowns above</li>
                <li>Red node = Source (Stage 0), Green node = Target (Last Stage)</li>
                <li>Orange nodes show the optimal path after running the algorithm</li>
              </ul>
              {isDrawingMode === 'edge' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium">
                    🎯 Edge Creation Mode: {edgeStart !== null ? 
                      `First node selected (${nodes.find(n => n.id === edgeStart)?.label}). Now click a node in the next stage to create an edge.` : 
                      'Click a node to start creating an edge to the next stage.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={prevStep}
                    disabled={animationStep <= 0}
                    className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!result || animationStep >= result.steps.length - 1}
                    className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {result.steps.length}
                  </span>
                </div>

                {/* Current Step Info */}
                {animationStep >= 0 && result.steps[animationStep] && (
                  <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-300">
                    <h3 className="font-bold text-indigo-800 mb-2 text-lg">
                      Stage {result.steps[animationStep].stage}: {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-indigo-700 font-medium">
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                    </div>
                  </div>
                )}

                {/* Cost Table */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">Cost Table</h3>
                  <div className="overflow-x-auto bg-white rounded border">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-indigo-600 text-white">
                          <th className="border border-gray-400 px-3 py-2 font-bold">Node</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Stage</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Cost to Target</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Next Node</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map(node => {
                          const step = animationStep >= 0 ? result.steps[animationStep] : result.steps[result.steps.length - 1];
                          const cost = step.costs ? step.costs[node.id] : Infinity;
                          const decision = step.decisions ? step.decisions[node.id] : null;
                          
                          return (
                            <tr key={node.id} className={`${
                              result.optimalPath && result.optimalPath.includes(node.id) ? 'bg-yellow-100 font-bold' : 'bg-white'
                            } border-b border-gray-300`}>
                              <td className="border border-gray-400 px-3 py-2 font-bold text-center text-indigo-700">
                                {node.label}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">
                                {node.stage}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-red-600">
                                {cost === Infinity ? '∞' : cost}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-green-600">
                                {decision !== null && decision !== undefined ? 
                                  nodes.find(n => n.id === decision)?.label || '-' : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h3 className="font-bold text-green-800 mb-3 text-lg">Optimal Solution</h3>
                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex justify-between">
                        <span>Minimum Cost:</span>
                        <span className="font-mono text-green-700 text-lg font-bold">{result.minCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimal Path:</span>
                        <span className="font-mono text-green-700">
                          {result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">📊</div>
                <p>Configure the multistage graph and click &quot;Find Shortest Path&quot; to see the solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Table */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution Table</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-700 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Step</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Stage</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Description</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Action</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Costs Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, index) => (
                    <tr key={index} className={`${
                      index === animationStep ? 'bg-yellow-200 font-bold' : 
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } border-b border-gray-300`}>
                      <td className="border border-gray-400 px-3 py-2 font-bold text-center text-indigo-600">{index + 1}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">{step.stage}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.description}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.action}</td>
                      <td className="border border-gray-400 px-3 py-2 font-mono text-xs text-center text-red-600 font-bold">
                        {step.costs ? Object.entries(step.costs)
                          .filter(([_, cost]) => cost !== Infinity)
                          .map(([nodeId, cost]) => `${nodes.find(n => n.id === parseInt(nodeId))?.label}:${cost}`)
                          .join(', ') : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Multistage Graph Algorithm Analysis"
            input={`Multistage graph with ${numStages} stages and ${nodes.length} vertices`}
            result={result.minCost < Infinity}
            steps={result.steps.slice(0, 10).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Stage ${step.stage}: Processing nodes and updating costs`,
              explanation: step.action
            }))}
            finalAnswer={`Minimum cost path: ${result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'} with cost ${result.minCost}`}
            examFormat={{
              question: `Find the shortest path in a multistage graph with ${numStages} stages using dynamic programming.`,
              solution: [
                `Multistage Graph Dynamic Programming Solution:`,
                `Number of stages: ${numStages}`,
                `Total vertices: ${nodes.length}`,
                `Source: ${nodes.find(n => n.stage === 0)?.label}`,
                `Target: ${nodes.find(n => n.stage === numStages - 1)?.label}`,
                ...result.steps.map((step, i) => `Step ${i + 1}: Stage ${step.stage} - ${step.action}`),
                `Optimal path: ${result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'}`,
                `Minimum cost: ${result.minCost}`
              ],
              conclusion: `The dynamic programming approach successfully found the optimal path with minimum cost ${result.minCost}.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
