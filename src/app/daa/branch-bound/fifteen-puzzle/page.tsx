"use client";

import { useState } from "react";
import { fifteenPuzzle, FifteenPuzzleResult } from "@/app/utils/branchAndBound";
import EducationalInfo from "@/components/EducationalInfo";

export default function FifteenPuzzlePage() {
  // Easy solvable puzzle (just one move away)
  const [initialBoard, setInitialBoard] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 0, 15]
  ]);
  
  const targetBoard = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  const [result, setResult] = useState<FifteenPuzzleResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSolve = () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    const puzzleResult = fifteenPuzzle(initialBoard, targetBoard);
    setResult(puzzleResult);
    
    // Animate through steps
    if (puzzleResult.steps.length > 0) {
      animateSteps(puzzleResult.steps);
    } else {
      setIsRunning(false);
    }
  };

  const animateSteps = (steps: FifteenPuzzleResult['steps']) => {
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) {
          setIsRunning(false);
        }
      }, index * 1500);
    });
  };

  const handleCellEdit = (row: number, col: number, value: string) => {
    const newValue = parseInt(value) || 0;
    if (newValue >= 0 && newValue <= 15) {
      const newBoard = initialBoard.map(r => [...r]);
      newBoard[row][col] = newValue;
      setInitialBoard(newBoard);
    }
  };

  const shuffleBoard = () => {
    generateSolvablePuzzle();
  };

  // Preset solvable puzzles
  const presetPuzzles = {
    easy: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 0, 15]
    ],
    medium: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 0, 11],
      [13, 14, 15, 12]
    ],
    hard: [
      [5, 1, 3, 4],
      [2, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0]
    ],
    expert: [
      [2, 3, 4, 8],
      [1, 6, 0, 12],
      [5, 10, 7, 11],
      [9, 13, 14, 15]
    ]
  };

  // Check if puzzle is solvable (same logic as in branchAndBound.ts)
  const isSolvable = (board: number[][]) => {
    const size = board.length;
    const flatBoard = board.flat();
    
    let inversions = 0;
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] !== 0 && flatBoard[j] !== 0 && flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }
    
    let emptyRow = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          emptyRow = size - i;
          break;
        }
      }
    }
    
    if (size === 4) {
      if (emptyRow % 2 === 0) {
        return inversions % 2 === 1;
      } else {
        return inversions % 2 === 0;
      }
    }
    
    return inversions % 2 === 0;
  };

  // Generate random solvable puzzle
  const generateSolvablePuzzle = () => {
    let attempts = 0;
    let newBoard;
    
    do {
      const numbers = Array.from({ length: 16 }, (_, i) => i);
      const shuffled = [...numbers].sort(() => Math.random() - 0.5);
      
      newBoard = [];
      for (let i = 0; i < 4; i++) {
        newBoard.push(shuffled.slice(i * 4, (i + 1) * 4));
      }
      attempts++;
    } while (!isSolvable(newBoard) && attempts < 100);
    
    if (isSolvable(newBoard)) {
      setInitialBoard(newBoard);
    } else {
      // Fallback to preset easy puzzle
      setInitialBoard(presetPuzzles.easy);
    }
  };

  // Load preset puzzle
  const loadPreset = (difficulty: keyof typeof presetPuzzles) => {
    setInitialBoard(presetPuzzles[difficulty].map(row => [...row]));
  };

  const renderBoard = (board: number[][], title: string, editable: boolean = false) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
        <div className="grid grid-cols-4 gap-2 w-64 mx-auto">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="relative">
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={cell || ''}
                    onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                    className={`w-12 h-12 border-2 rounded-lg text-center font-bold text-lg ${
                      cell === 0 
                        ? 'bg-gray-200 border-gray-400 text-gray-500' 
                        : 'bg-blue-100 border-blue-400 text-blue-800'
                    } focus:outline-none focus:border-blue-600`}
                  />
                ) : (
                  <div
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg ${
                      cell === 0 
                        ? 'bg-gray-200 border-gray-400 text-gray-500' 
                        : 'bg-blue-100 border-blue-400 text-blue-800'
                    }`}
                  >
                    {cell || ''}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPuzzleVisualization = () => {
    if (!result || !result.steps.length) return null;
    
    const step = result.steps[currentStep];
    
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Step {step.step + 1}: {step.description}</h3>
        
        <div className="flex justify-center items-center gap-8">
          <div>
            {renderBoard(step.board, `Move: ${step.move || 'Initial'}`)}
          </div>
          
          <div className="text-left space-y-2">
            <p><strong>Cost (g):</strong> {step.cost}</p>
            <p><strong>Heuristic (h):</strong> {step.heuristic}</p>
            <p><strong>Total (f = g + h):</strong> {step.total}</p>
            <p><strong>Move:</strong> {step.move || 'Initial state'}</p>
          </div>
        </div>
      </div>
    );
  };

  const educationalInfo = {
    topic: "15-Puzzle using Branch & Bound",
    description: "The 15-puzzle is a classic sliding puzzle that uses branch and bound with A* algorithm to find the optimal solution.",
    theory: {
      definition: "Branch and bound with A* algorithm explores the state space systematically, using a heuristic function to guide the search towards the goal state while maintaining optimality.",
      keyPoints: [
        "Uses Manhattan distance as heuristic function",
        "Explores states in order of f(n) = g(n) + h(n)",
        "Guarantees optimal solution if heuristic is admissible",
        "Pruning reduces the search space significantly"
      ],
      applications: [
        "Puzzle solving games",
        "Path planning in robotics",
        "AI game playing algorithms",
        "Optimization problems with constraints"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "Branch and bound technique",
        "A* algorithm and heuristics",
        "State space search",
        "Admissible heuristics"
      ],
      marks: "15-20 marks",
      commonQuestions: [
        "Explain branch and bound for 15-puzzle",
        "What is Manhattan distance heuristic?",
        "How does A* guarantee optimal solution?",
        "Compare branch and bound with other search methods"
      ],
      examTips: [
        "Understand Manhattan distance calculation",
        "Draw state space tree with f, g, h values",
        "Explain pruning conditions clearly",
        "Practice with small puzzle instances"
      ]
    },
    algorithm: {
      steps: [
        "Initialize priority queue with initial state",
        "Calculate f(n) = g(n) + h(n) for each state",
        "Select state with minimum f(n) value",
        "Generate all possible moves from current state",
        "Add new states to queue if not visited",
        "Repeat until goal state is reached or queue is empty"
      ],
      complexity: {
        time: "O(b^d) where b is branching factor and d is depth",
        space: "O(b^d) for storing the frontier"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            15-Puzzle Solver using Branch & Bound
          </h1>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div>
              {renderBoard(initialBoard, "Initial State", true)}
              <div className="text-center mt-4 space-y-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => loadPreset('easy')}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => loadPreset('medium')}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => loadPreset('hard')}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => loadPreset('expert')}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Expert
                  </button>
                </div>
                <button
                  onClick={shuffleBoard}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Random Solvable
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  Solvable: {isSolvable(initialBoard) ? '✅ Yes' : '❌ No'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={handleSolve}
                  disabled={isRunning}
                  className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                >
                  {isRunning ? "Solving..." : "Solve Puzzle"}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Uses A* with Manhattan distance heuristic
                </p>
              </div>
            </div>
            
            <div>
              {renderBoard(targetBoard, "Target State")}
            </div>
          </div>

          {/* Visualization */}
          {result && (
            <div className="mb-8">
              {renderPuzzleVisualization()}
              
              {/* Results Summary */}
              {!isRunning && (
                <div className="mt-6 p-6 bg-orange-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Solution Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.solved ? 'text-green-600' : 'text-red-600'}`}>
                        {result.solved ? 'Solved!' : 'Unsolvable'}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.totalMoves}</div>
                      <div className="text-sm text-gray-600">Optimal Moves</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.nodesExplored}</div>
                      <div className="text-sm text-gray-600">Nodes Explored</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.steps.length}</div>
                      <div className="text-sm text-gray-600">Algorithm Steps</div>
                    </div>
                  </div>
                  
                  {result.solved && result.solution && (
                    <div className="mt-4">
                      <p className="font-semibold">Solution moves: {result.solution.join(' → ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educational Content */}
        <EducationalInfo {...educationalInfo} />

        {/* Quiz Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Your Understanding</h2>
          <div className="space-y-6">
            <div className="p-6 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Key Concepts to Remember:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Manhattan distance is an admissible heuristic for 15-puzzle</li>
                <li>A* algorithm guarantees optimal solution with admissible heuristics</li>
                <li>Branch and bound prunes suboptimal paths early</li>
                <li>State space can be very large (16! possible states)</li>
                <li>f(n) = g(n) + h(n) guides the search strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
