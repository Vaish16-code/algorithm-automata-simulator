"use client";

import { useState, useRef, useEffect } from "react";
import { Graph, Edge } from "../app/utils/greedyAlgorithms";

interface Node {
  id: string;
  x: number;
  y: number;
}

interface GraphBuilderProps {
  onGraphChange: (graph: Graph) => void;
  initialGraph?: Graph;
}

export function GraphBuilder({ onGraphChange, initialGraph }: GraphBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [mode, setMode] = useState<'node' | 'edge'>('node');
  const svgRef = useRef<SVGSVGElement>(null);
  const [nextNodeLabel, setNextNodeLabel] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [deletedNodes, setDeletedNodes] = useState<Node[]>([]);
  const [deletedEdges, setDeletedEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [draggingEdge, setDraggingEdge] = useState<Edge | null>(null);
  const [edgeDragMode, setEdgeDragMode] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    if (initialGraph && initialGraph.vertices.length > 0) {
      // Convert initial graph to visual representation
      const nodeSet = new Set<string>();
      initialGraph.edges.forEach(edge => {
        nodeSet.add(edge.from);
        nodeSet.add(edge.to);
      });
      
      const nodeArray = Array.from(nodeSet).map((id, index) => ({
        id,
        x: 100 + (index % 4) * 120,
        y: 100 + Math.floor(index / 4) * 120
      }));
      
      setNodes(nodeArray);
      setEdges(initialGraph.edges);
      setNextNodeLabel(nodeSet.size);
    }
  }, []);

  // Remove the problematic useEffect - we'll call onGraphChange manually
  const updateGraph = (newNodes: Node[], newEdges: Edge[]) => {
    const graph = {
      vertices: newNodes.map(n => n.id),
      edges: newEdges
    };
    onGraphChange(graph);
  };

  const generateNodeLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setDebugInfo(`SVG clicked at ${new Date().toLocaleTimeString()}, mode: ${mode}`);
    
    // Clear edge selection when clicking on empty space
    setSelectedEdge(null);
    
    if (mode !== 'node') return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newNode: Node = {
      id: generateNodeLabel(nextNodeLabel),
      x,
      y
    };
    
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setNextNodeLabel(nextNodeLabel + 1);
    setDebugInfo(`Added node ${newNode.id} at (${x.toFixed(0)}, ${y.toFixed(0)})`);
    
    // Manually update graph
    updateGraph(updatedNodes, edges);
  };

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Check if we're dropping an edge endpoint
    if (draggingEdge && edgeDragMode) {
      handleEdgeEndpointDrop(nodeId);
      return;
    }
    
    if (mode === 'edge') {
      if (!selectedNode) {
        setSelectedNode(nodeId);
        setIsAddingEdge(true);
      } else if (selectedNode !== nodeId) {
        // Create edge between selectedNode and nodeId
        const weight = parseInt(edgeWeight) || 1;
        const newEdge: Edge = {
          from: selectedNode,
          to: nodeId,
          weight
        };
        
        // Check if edge already exists
        const edgeExists = edges.some(e => 
          (e.from === selectedNode && e.to === nodeId) ||
          (e.from === nodeId && e.to === selectedNode)
        );
        
        if (!edgeExists) {
          const updatedEdges = [...edges, newEdge];
          setEdges(updatedEdges);
          updateGraph(nodes, updatedEdges);
        }
        
        setSelectedNode(null);
        setIsAddingEdge(false);
      }
    }
  };

  const handleNodeMouseDown = (nodeId: string, event: React.MouseEvent) => {
    if (mode === 'node') {
      event.stopPropagation();
      setDraggedNode(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setDragOffset({
            x: event.clientX - rect.left - node.x,
            y: event.clientY - rect.top - node.y
          });
        }
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (draggedNode && mode === 'node') {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const newX = Math.max(25, Math.min(575, event.clientX - rect.left - dragOffset.x));
      const newY = Math.max(25, Math.min(375, event.clientY - rect.top - dragOffset.y));
      
      const updatedNodes = nodes.map(node => 
        node.id === draggedNode 
          ? { ...node, x: newX, y: newY }
          : node
      );
      
      setNodes(updatedNodes);
      updateGraph(updatedNodes, edges);
    }
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      setDraggedNode(null);
      setDragOffset({ x: 0, y: 0 });
    }
    if (draggingEdge) {
      setDraggingEdge(null);
      setEdgeDragMode(null);
    }
  };

  const handleEdgeClick = (edge: Edge, event: React.MouseEvent) => {
    event.stopPropagation();
    if (mode === 'edge') {
      setSelectedEdge(selectedEdge?.from === edge.from && selectedEdge?.to === edge.to ? null : edge);
      setDebugInfo(`Selected edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`);
    }
  };

  const handleEdgeEndpointMouseDown = (edge: Edge, endpoint: 'from' | 'to', event: React.MouseEvent) => {
    if (mode === 'edge') {
      event.stopPropagation();
      setDraggingEdge(edge);
      setEdgeDragMode(endpoint);
      setDebugInfo(`Dragging ${endpoint} endpoint of edge (${edge.from}, ${edge.to})`);
    }
  };

  const handleEdgeEndpointDrop = (targetNodeId: string) => {
    if (draggingEdge && edgeDragMode) {
      const updatedEdges = edges.map(edge => {
        if (edge.from === draggingEdge.from && edge.to === draggingEdge.to) {
          if (edgeDragMode === 'from') {
            return { ...edge, from: targetNodeId };
          } else {
            return { ...edge, to: targetNodeId };
          }
        }
        return edge;
      });
      
      setEdges(updatedEdges);
      updateGraph(nodes, updatedEdges);
      setDebugInfo(`Moved edge endpoint to node ${targetNodeId}`);
    }
  };

  const removeNode = (nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    const edgesToDelete = edges.filter(e => e.from === nodeId || e.to === nodeId);
    
    // Store deleted items for undo
    if (nodeToDelete) {
      setDeletedNodes(prev => [...prev, nodeToDelete]);
    }
    setDeletedEdges(prev => [...prev, ...edgesToDelete]);
    
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedEdges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    updateGraph(updatedNodes, updatedEdges);
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setIsAddingEdge(false);
    }
    
    setDebugInfo(`Deleted node ${nodeId} and its ${edgesToDelete.length} edges`);
  };

  const removeEdge = (edge: Edge) => {
    // Store deleted edge for undo
    setDeletedEdges(prev => [...prev, edge]);
    
    const updatedEdges = edges.filter(e => 
      !(e.from === edge.from && e.to === edge.to) &&
      !(e.from === edge.to && e.to === edge.from)
    );
    setEdges(updatedEdges);
    updateGraph(nodes, updatedEdges);
    
    setDebugInfo(`Deleted edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`);
  };

  const clearGraph = () => {
    // Store all current items for undo
    setDeletedNodes([...deletedNodes, ...nodes]);
    setDeletedEdges([...deletedEdges, ...edges]);
    
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setIsAddingEdge(false);
    setNextNodeLabel(0);
    updateGraph([], []);
    
    setDebugInfo("Cleared entire graph");
  };

  const deleteSelectedEdge = () => {
    if (selectedEdge) {
      removeEdge(selectedEdge);
      setSelectedEdge(null);
    }
  };

  const undoLastDelete = () => {
    if (deletedNodes.length > 0) {
      const lastDeletedNode = deletedNodes[deletedNodes.length - 1];
      const relatedEdges = deletedEdges.filter(e => 
        e.from === lastDeletedNode.id || e.to === lastDeletedNode.id
      );
      
      // Only restore edges where both nodes exist
      const validEdges = relatedEdges.filter(edge => {
        const fromExists = nodes.some(n => n.id === edge.from) || edge.from === lastDeletedNode.id;
        const toExists = nodes.some(n => n.id === edge.to) || edge.to === lastDeletedNode.id;
        return fromExists && toExists;
      });
      
      const updatedNodes = [...nodes, lastDeletedNode];
      const updatedEdges = [...edges, ...validEdges];
      
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setDeletedNodes(prev => prev.slice(0, -1));
      setDeletedEdges(prev => prev.filter(e => !validEdges.includes(e)));
      
      updateGraph(updatedNodes, updatedEdges);
      setDebugInfo(`Restored node ${lastDeletedNode.id} and ${validEdges.length} edges`);
    } else if (deletedEdges.length > 0) {
      const lastDeletedEdge = deletedEdges[deletedEdges.length - 1];
      
      // Check if both nodes still exist
      const fromExists = nodes.some(n => n.id === lastDeletedEdge.from);
      const toExists = nodes.some(n => n.id === lastDeletedEdge.to);
      
      if (fromExists && toExists) {
        const updatedEdges = [...edges, lastDeletedEdge];
        setEdges(updatedEdges);
        setDeletedEdges(prev => prev.slice(0, -1));
        updateGraph(nodes, updatedEdges);
        setDebugInfo(`Restored edge (${lastDeletedEdge.from}, ${lastDeletedEdge.to})`);
      } else {
        setDeletedEdges(prev => prev.slice(0, -1));
        setDebugInfo("Cannot restore edge - one or both nodes no longer exist");
      }
    }
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // Debug logging - removed for production
  
  return (
    <div className="bg-white rounded-lg p-6 border-4 border-gray-800">
      <h3 className="text-xl font-bold mb-4">Interactive Graph Builder</h3>
      
      {/* Controls */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('node'); setSelectedNode(null); setIsAddingEdge(false); }}
              className={`px-4 py-2 rounded font-medium ${
                mode === 'node' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Add Nodes
            </button>
            <button
              onClick={() => { setMode('edge'); setSelectedNode(null); setIsAddingEdge(false); }}
              className={`px-4 py-2 rounded font-medium ${
                mode === 'edge' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Add Edges
            </button>
          </div>
          
          {mode === 'edge' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Edge Weight:</label>
              <input
                type="text"
                placeholder="W"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                className="w-16 border-2 border-gray-400 rounded px-2 py-1 text-center"
              />
            </div>
          )}
          
          <button
            onClick={clearGraph}
            className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
          >
            Clear Graph
          </button>
          
          <button
            onClick={undoLastDelete}
            disabled={deletedNodes.length === 0 && deletedEdges.length === 0}
            className="px-4 py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ↶ Undo Delete
          </button>
          
          <button
            onClick={() => {
              const testNode: Node = {
                id: generateNodeLabel(nextNodeLabel),
                x: 100 + Math.random() * 400,
                y: 100 + Math.random() * 200
              };
              const updatedNodes = [...nodes, testNode];
              setNodes(updatedNodes);
              setNextNodeLabel(nextNodeLabel + 1);
              setDebugInfo(`Test node ${testNode.id} added programmatically`);
              updateGraph(updatedNodes, edges);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
          >
            Add Test Node
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <strong>Current Mode: {mode.toUpperCase()}</strong><br/>
          {mode === 'node' ? (
            "Click to add nodes • Drag nodes to move them"
          ) : (
            isAddingEdge ? (
              `Selected: ${selectedNode}. Click another node to create edge.`
            ) : (
              "Click two nodes to create an edge between them"
            )
          )}
          {(deletedNodes.length > 0 || deletedEdges.length > 0) && (
            <div className="mt-1 text-xs text-orange-600">
              {deletedNodes.length + deletedEdges.length} item(s) can be restored with Undo
            </div>
          )}
          {debugInfo && (
            <div className="mt-1 text-xs text-blue-600">
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="border-2 border-gray-300 rounded bg-gray-50 overflow-hidden">
        <svg
          ref={svgRef}
          width="600"
          height="400"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`${mode === 'node' ? 'cursor-crosshair' : 'cursor-pointer'} block`}
          style={{ 
            pointerEvents: 'auto',
            userSelect: 'none',
            background: '#f9fafb'
          }}
        >
          {/* Background grid for visual reference */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Render edges */}
          {edges.map((edge, index) => {
            const fromPos = getNodePosition(edge.from);
            const toPos = getNodePosition(edge.to);
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            
            const isSelected = selectedEdge?.from === edge.from && selectedEdge?.to === edge.to;
            const isDragging = draggingEdge?.from === edge.from && draggingEdge?.to === edge.to;
            
            return (
              <g key={index}>
                {/* Main edge line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={isSelected ? "#ef4444" : isDragging ? "#f59e0b" : "#374151"}
                  strokeWidth={isSelected ? "4" : "3"}
                  className="hover:stroke-red-500 cursor-pointer"
                  onClick={(e) => handleEdgeClick(edge, e)}
                />
                
                {/* Draggable endpoints (visible only when edge is selected) */}
                {isSelected && (
                  <>
                    {/* From endpoint */}
                    <circle
                      cx={fromPos.x}
                      cy={fromPos.y}
                      r="8"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-grab hover:cursor-grabbing"
                      onMouseDown={(e) => handleEdgeEndpointMouseDown(edge, 'from', e)}
                    />
                    {/* To endpoint */}
                    <circle
                      cx={toPos.x}
                      cy={toPos.y}
                      r="8"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-grab hover:cursor-grabbing"
                      onMouseDown={(e) => handleEdgeEndpointMouseDown(edge, 'to', e)}
                    />
                  </>
                )}
                
                {/* Weight label */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="15"
                  fill="white"
                  stroke={isSelected ? "#ef4444" : "#374151"}
                  strokeWidth="2"
                />
                <text
                  x={midX}
                  y={midY + 5}
                  textAnchor="middle"
                  className="text-sm font-bold fill-black pointer-events-none"
                >
                  {edge.weight}
                </text>
                
                {/* Delete button for selected edge */}
                {isSelected && (
                  <>
                    <circle
                      cx={midX + 20}
                      cy={midY - 20}
                      r="10"
                      fill="#ef4444"
                      className="cursor-pointer hover:fill-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEdge(edge);
                        setSelectedEdge(null);
                      }}
                    />
                    <text
                      x={midX + 20}
                      y={midY - 15}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                    >
                      ×
                    </text>
                  </>
                )}
              </g>
            );
          })}
          
          {/* Render nodes */}
          {nodes.map((node) => {
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill={
                    draggedNode === node.id 
                      ? "#f59e0b" 
                      : selectedNode === node.id 
                        ? "#fbbf24" 
                        : "#3b82f6"
                  }
                  stroke="#1f2937"
                  strokeWidth="3"
                  className={`cursor-pointer hover:fill-blue-400 ${
                    mode === 'node' ? 'cursor-move' : 'cursor-pointer'
                  }`}
                  onClick={(e) => handleNodeClick(node.id, e)}
                  onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-lg font-bold fill-white pointer-events-none"
                >
                  {node.id}
                </text>
                {/* Delete button for nodes */}
                <circle
                  cx={node.x + 20}
                  cy={node.y - 20}
                  r="8"
                  fill="#ef4444"
                  className="cursor-pointer hover:fill-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                />
                <text
                  x={node.x + 20}
                  y={node.y - 16}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white pointer-events-none"
                >
                  ×
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Graph Summary */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Graph Summary:</h4>
        <div className="text-sm">
          <p><strong>Nodes:</strong> {nodes.map(n => n.id).join(', ') || 'None'}</p>
          <p><strong>Edges:</strong> {edges.length > 0 ? edges.map(e => `(${e.from},${e.to}):${e.weight}`).join(', ') : 'None'}</p>
        </div>
      </div>
    </div>
  );
}
