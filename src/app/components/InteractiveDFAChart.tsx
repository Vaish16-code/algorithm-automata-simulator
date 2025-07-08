'use client';

import React, { useState, useRef, useCallback } from 'react';
import { State, Transition, FAResult } from '../utils/automataTheory';

interface InteractiveDFAChartProps {
  states: State[];
  transitions: Transition[];
  alphabet: string[];
  result?: FAResult | null;
  onStatesChange: (states: State[]) => void;
  onTransitionsChange: (transitions: Transition[]) => void;
}

interface Point {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  dragType: 'state' | 'transition' | null;
  draggedStateIndex: number | null;
  startPoint: Point | null;
  tempTransition: { from: string; to: Point } | null;
}

export function InteractiveDFAChart({ 
  states, 
  transitions, 
  alphabet, 
  result, 
  onStatesChange, 
  onTransitionsChange 
}: InteractiveDFAChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    draggedStateIndex: null,
    startPoint: null,
    tempTransition: null
  });
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; stateIndex: number } | null>(null);
  const [statePositions, setStatePositions] = useState<Point[]>(() => 
    states.map((_, index) => getInitialStatePosition(index, states.length))
  );

  function getInitialStatePosition(index: number, total: number): Point {
    const angle = (2 * Math.PI * index) / total;
    const radius = Math.min(120, 60 + total * 8);
    const centerX = 250;
    const centerY = 200;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  const getSVGPoint = useCallback((clientX: number, clientY: number): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const getDistanceToState = (point: Point, statePos: Point): number => {
    return Math.sqrt(Math.pow(point.x - statePos.x, 2) + Math.pow(point.y - statePos.y, 2));
  };

  const findStateAtPoint = (point: Point): number | null => {
    for (let i = 0; i < statePositions.length; i++) {
      if (getDistanceToState(point, statePositions[i]) <= 25) {
        return i;
      }
    }
    return null;
  };

  const handleSVGClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Click to add new state
      const point = getSVGPoint(e.clientX, e.clientY);
      const newStateName = `q${states.length}`;
      const newState: State = {
        name: newStateName,
        isStart: states.length === 0,
        isAccept: false
      };
      
      onStatesChange([...states, newState]);
      setStatePositions([...statePositions, point]);
    }
    setShowContextMenu(null);
  };

  const handleStateMouseDown = (e: React.MouseEvent, stateIndex: number) => {
    e.stopPropagation();
    const point = getSVGPoint(e.clientX, e.clientY);
    
    if (e.shiftKey) {
      // Shift+Click to start creating transition
      setDragState({
        isDragging: true,
        dragType: 'transition',
        draggedStateIndex: stateIndex,
        startPoint: point,
        tempTransition: { from: states[stateIndex].name, to: point }
      });
    } else {
      // Regular click to drag state
      setDragState({
        isDragging: true,
        dragType: 'state',
        draggedStateIndex: stateIndex,
        startPoint: point,
        tempTransition: null
      });
    }
    setSelectedState(stateIndex);
  };

  const handleStateRightClick = (e: React.MouseEvent, stateIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const point = getSVGPoint(e.clientX, e.clientY);
    setShowContextMenu({ x: point.x, y: point.y, stateIndex });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging) return;

    const point = getSVGPoint(e.clientX, e.clientY);

    if (dragState.dragType === 'state' && dragState.draggedStateIndex !== null) {
      const newPositions = [...statePositions];
      newPositions[dragState.draggedStateIndex] = point;
      setStatePositions(newPositions);
    } else if (dragState.dragType === 'transition' && dragState.tempTransition) {
      setDragState(prev => ({
        ...prev,
        tempTransition: { ...prev.tempTransition!, to: point }
      }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragState.isDragging) return;

    if (dragState.dragType === 'transition' && dragState.draggedStateIndex !== null) {
      const point = getSVGPoint(e.clientX, e.clientY);
      const targetStateIndex = findStateAtPoint(point);
      
      if (targetStateIndex !== null && alphabet.length > 0) {
        const fromState = states[dragState.draggedStateIndex];
        const toState = states[targetStateIndex];
        
        // Check if transition already exists
        const existingTransition = transitions.find(
          t => t.from === fromState.name && t.to === toState.name && t.symbol === alphabet[0]
        );
        
        if (!existingTransition) {
          const newTransition: Transition = {
            from: fromState.name,
            to: toState.name,
            symbol: alphabet[0] // Use first symbol by default
          };
          onTransitionsChange([...transitions, newTransition]);
        }
      }
    }

    setDragState({
      isDragging: false,
      dragType: null,
      draggedStateIndex: null,
      startPoint: null,
      tempTransition: null
    });
  };

  const toggleStartState = (stateIndex: number) => {
    const newStates = states.map((state, i) => ({
      ...state,
      isStart: i === stateIndex ? !state.isStart : false
    }));
    onStatesChange(newStates);
    setShowContextMenu(null);
  };

  const toggleAcceptState = (stateIndex: number) => {
    const newStates = states.map((state, i) => 
      i === stateIndex ? { ...state, isAccept: !state.isAccept } : state
    );
    onStatesChange(newStates);
    setShowContextMenu(null);
  };

  const deleteState = (stateIndex: number) => {
    if (states.length <= 1) return;
    
    const stateToDelete = states[stateIndex];
    const newStates = states.filter((_, i) => i !== stateIndex);
    const newTransitions = transitions.filter(
      t => t.from !== stateToDelete.name && t.to !== stateToDelete.name
    );
    const newPositions = statePositions.filter((_, i) => i !== stateIndex);
    
    onStatesChange(newStates);
    onTransitionsChange(newTransitions);
    setStatePositions(newPositions);
    setShowContextMenu(null);
  };

  const deleteTransition = (transitionIndex: number) => {
    const newTransitions = transitions.filter((_, i) => i !== transitionIndex);
    onTransitionsChange(newTransitions);
  };

  const getTransitionPath = (fromPos: Point, toPos: Point, isLoop: boolean = false) => {
    if (isLoop) {
      return {
        path: `M ${fromPos.x} ${fromPos.y - 25} A 20 20 0 1 1 ${fromPos.x + 1} ${fromPos.y - 25}`,
        labelPos: { x: fromPos.x, y: fromPos.y - 45 }
      };
    }

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;

    const startX = fromPos.x + unitX * 25;
    const startY = fromPos.y + unitY * 25;
    const endX = toPos.x - unitX * 25;
    const endY = toPos.y - unitY * 25;

    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      labelPos: { x: (startX + endX) / 2, y: (startY + endY) / 2 - 10 }
    };
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Interactive Controls:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Ctrl+Click:</strong> Add new state</li>
          <li><strong>Shift+Click & Drag:</strong> Create transition between states</li>
          <li><strong>Right-click state:</strong> Configure state properties</li>
          <li><strong>Click transition label:</strong> Delete transition</li>
          <li><strong>Drag state:</strong> Move state position</li>
        </ul>
      </div>

      <div className="relative">
        <svg 
          ref={svgRef}
          width="100%" 
          height="400" 
          viewBox="0 0 500 400"
          preserveAspectRatio="xMidYMid meet"
          className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
          onClick={handleSVGClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
            </marker>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Draw transitions */}
          {transitions.map((transition, index) => {
            const fromIndex = states.findIndex(s => s.name === transition.from);
            const toIndex = states.findIndex(s => s.name === transition.to);
            
            if (fromIndex === -1 || toIndex === -1 || fromIndex >= statePositions.length || toIndex >= statePositions.length) return null;
            
            const fromPos = statePositions[fromIndex];
            const toPos = statePositions[toIndex];
            const isLoop = fromIndex === toIndex;
            const { path, labelPos } = getTransitionPath(fromPos, toPos, isLoop);
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="2"
                  markerEnd={isLoop ? undefined : "url(#arrowhead)"}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1f2937"
                  className="cursor-pointer hover:fill-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTransition(index);
                  }}
                >
                  {transition.symbol}
                </text>
              </g>
            );
          })}

          {/* Draw temporary transition while dragging */}
          {dragState.tempTransition && (
            <line
              x1={statePositions[dragState.draggedStateIndex!]?.x || 0}
              y1={statePositions[dragState.draggedStateIndex!]?.y || 0}
              x2={dragState.tempTransition.to.x}
              y2={dragState.tempTransition.to.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Draw states */}
          {states.map((state, index) => {
            if (index >= statePositions.length) return null;
            
            const pos = statePositions[index];
            const isCurrentState = result?.steps && result.steps.length > 0 
              ? result.steps[result.steps.length - 1].currentState === state.name
              : false;
            const isSelected = selectedState === index;
            
            return (
              <g key={index}>
                {/* Accept state (double circle) */}
                {state.isAccept && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="28"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="2"
                  />
                )}
                
                {/* Main circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
                  fill={isCurrentState ? "#86efac" : isSelected ? "#ddd6fe" : "#bfdbfe"}
                  stroke={isSelected ? "#7c3aed" : "#1e40af"}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="cursor-pointer hover:stroke-purple-500"
                  onMouseDown={(e) => handleStateMouseDown(e, index)}
                  onContextMenu={(e) => handleStateRightClick(e, index)}
                />
                
                {/* Start state arrow */}
                {state.isStart && (
                  <line
                    x1={pos.x - 50}
                    y1={pos.y}
                    x2={pos.x - 27}
                    y2={pos.y}
                    stroke="#1e40af"
                    strokeWidth="3"
                    markerEnd="url(#arrowhead)"
                  />
                )}
                
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1f2937"
                  className="pointer-events-none"
                >
                  {state.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Context Menu */}
        {showContextMenu && (
          <div 
            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-10"
            style={{ left: showContextMenu.x, top: showContextMenu.y }}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => toggleStartState(showContextMenu.stateIndex)}
            >
              {states[showContextMenu.stateIndex]?.isStart ? 'Remove Start State' : 'Set as Start State'}
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => toggleAcceptState(showContextMenu.stateIndex)}
            >
              {states[showContextMenu.stateIndex]?.isAccept ? 'Remove Accept State' : 'Set as Accept State'}
            </button>
            <hr className="my-1" />
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => deleteState(showContextMenu.stateIndex)}
              disabled={states.length <= 1}
            >
              Delete State
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-200 border-2 border-blue-800"></div>
            <span>State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-300 border-2 border-blue-800"></div>
            <span>Current State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-200 border-4 border-blue-800"></div>
            <span>Accept State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-purple-200 border-2 border-purple-700"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
