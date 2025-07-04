"use client";

import { useState } from "react";

interface Matrix {
  data: number[][];
  size: number;
}

interface StrassenStep {
  operation: string;
  matrix: number[][];
  description: string;
}

export default function StrassenPage() {
  const [matrixA, setMatrixA] = useState<Matrix>({
    data: [[1, 2], [3, 4]], 
    size: 2
  });
  const [matrixB, setMatrixB] = useState<Matrix>({
    data: [[5, 6], [7, 8]], 
    size: 2
  });
  const [result, setResult] = useState<Matrix | null>(null);
  const [steps, setSteps] = useState<StrassenStep[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Traditional matrix multiplication
  const traditionalMultiply = (A: number[][], B: number[][]): number[][] => {
    const n = A.length;
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  };

  // Strassen's matrix multiplication
  const strassenMultiply = (A: number[][], B: number[][], steps: StrassenStep[] = []): number[][] => {
    const n = A.length;
    
    // Base case
    if (n === 1) {
      const result = [[A[0][0] * B[0][0]]];
      steps.push({
        operation: "Base Case",
        matrix: result,
        description: `1x1 multiplication: ${A[0][0]} × ${B[0][0]} = ${result[0][0]}`
      });
      return result;
    }

    // Divide matrices into quadrants
    const mid = n / 2;
    const A11 = extractSubMatrix(A, 0, 0, mid);
    const A12 = extractSubMatrix(A, 0, mid, mid);
    const A21 = extractSubMatrix(A, mid, 0, mid);
    const A22 = extractSubMatrix(A, mid, mid, mid);

    const B11 = extractSubMatrix(B, 0, 0, mid);
    const B12 = extractSubMatrix(B, 0, mid, mid);
    const B21 = extractSubMatrix(B, mid, 0, mid);
    const B22 = extractSubMatrix(B, mid, mid, mid);

    steps.push({
      operation: "Divide",
      matrix: A,
      description: "Divided matrices into 2×2 quadrants"
    });

    // Calculate Strassen's 7 products
    const P1 = strassenMultiply(A11, subtractMatrices(B12, B22));
    const P2 = strassenMultiply(addMatrices(A11, A12), B22);
    const P3 = strassenMultiply(addMatrices(A21, A22), B11);
    const P4 = strassenMultiply(A22, subtractMatrices(B21, B11));
    const P5 = strassenMultiply(addMatrices(A11, A22), addMatrices(B11, B22));
    const P6 = strassenMultiply(subtractMatrices(A12, A22), addMatrices(B21, B22));
    const P7 = strassenMultiply(subtractMatrices(A11, A21), addMatrices(B11, B12));

    steps.push({
      operation: "Compute P1-P7",
      matrix: [[0, 0], [0, 0]],
      description: "Computed 7 Strassen products using recursive calls"
    });

    // Combine results
    const C11 = addMatrices(subtractMatrices(addMatrices(P5, P4), P2), P6);
    const C12 = addMatrices(P1, P2);
    const C21 = addMatrices(P3, P4);
    const C22 = subtractMatrices(subtractMatrices(addMatrices(P5, P1), P3), P7);

    // Combine quadrants
    const result = combineQuadrants(C11, C12, C21, C22);
    
    steps.push({
      operation: "Combine",
      matrix: result,
      description: "Combined quadrants to form final result matrix"
    });

    return result;
  };

  // Helper functions
  const extractSubMatrix = (matrix: number[][], row: number, col: number, size: number): number[][] => {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(matrix[row + i].slice(col, col + size));
    }
    return result;
  };

  const addMatrices = (A: number[][], B: number[][]): number[][] => {
    const n = A.length;
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = A[i][j] + B[i][j];
      }
    }
    return result;
  };

  const subtractMatrices = (A: number[][], B: number[][]): number[][] => {
    const n = A.length;
    const result = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = A[i][j] - B[i][j];
      }
    }
    return result;
  };

  const combineQuadrants = (C11: number[][], C12: number[][], C21: number[][], C22: number[][]): number[][] => {
    const size = C11.length;
    const result = Array(size * 2).fill(0).map(() => Array(size * 2).fill(0));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        result[i][j] = C11[i][j];
        result[i][j + size] = C12[i][j];
        result[i + size][j] = C21[i][j];
        result[i + size][j + size] = C22[i][j];
      }
    }
    return result;
  };

  const handleMultiply = () => {
    const newSteps: StrassenStep[] = [];
    const resultMatrix = strassenMultiply(matrixA.data, matrixB.data, newSteps);
    setResult({ data: resultMatrix, size: matrixA.size });
    setSteps(newSteps);
  };

  const updateMatrix = (isMatrixA: boolean, row: number, col: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (isMatrixA) {
      const newData = [...matrixA.data];
      newData[row][col] = numValue;
      setMatrixA({ ...matrixA, data: newData });
    } else {
      const newData = [...matrixB.data];
      newData[row][col] = numValue;
      setMatrixB({ ...matrixB, data: newData });
    }
  };

  const generateRandomMatrices = () => {
    const size = 2; // Keep it simple for Strassen's demo
    const generateMatrix = () => 
      Array(size).fill(0).map(() => 
        Array(size).fill(0).map(() => Math.floor(Math.random() * 10) + 1)
      );
    
    setMatrixA({ data: generateMatrix(), size });
    setMatrixB({ data: generateMatrix(), size });
  };

  const MatrixDisplay = ({ matrix, title }: { matrix: number[][], title: string }) => (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="inline-block border border-gray-300 p-4 bg-white rounded">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((cell, j) => (
              <span key={j} className="w-12 h-8 flex items-center justify-center text-lg font-mono">
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const MatrixInput = ({ matrix, title, isMatrixA }: { matrix: Matrix, title: string, isMatrixA: boolean }) => (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="inline-block border border-gray-300 p-4 bg-white rounded">
        {matrix.data.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2">
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => updateMatrix(isMatrixA, i, j, e.target.value)}
                className="w-12 h-8 text-center border border-gray-300 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const educationalContent = {
    introduction: "Strassen's algorithm is a divide-and-conquer method for matrix multiplication that reduces the number of recursive multiplications from 8 to 7, achieving better asymptotic complexity.",
    steps: [
      "Divide each matrix into four n/2 × n/2 submatrices",
      "Compute seven products P1 through P7 using specific combinations",
      "Calculate result quadrants using these products",
      "Combine quadrants to form the final result matrix"
    ],
    complexity: {
      time: "O(n^2.807) compared to O(n^3) for traditional multiplication",
      space: "O(n^2) for storing intermediate matrices"
    },
    advantages: [
      "Better asymptotic complexity for large matrices",
      "Theoretical importance in computational complexity",
      "Foundation for other fast matrix algorithms"
    ],
    disadvantages: [
      "Higher constant factors make it slower for small matrices",
      "More complex implementation",
      "Numerical stability concerns due to subtraction operations"
    ]
  };

  const examInfo = {
    examRelevance: "Strassen's algorithm is important for understanding advanced divide-and-conquer techniques and complexity analysis. Often asked in theoretical computer science and algorithms courses.",
    commonQuestions: [
      "Derive the seven Strassen products P1-P7",
      "Compare time complexity with traditional matrix multiplication",
      "Explain why Strassen's algorithm is faster asymptotically",
      "Discuss practical considerations and when to use each method"
    ],
    tips: [
      "Remember the seven product formulas",
      "Understand the recursive structure",
      "Practice complexity analysis using master theorem",
      "Know the crossover point where Strassen becomes beneficial"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Strassen&apos;s <span className="text-purple-600">Matrix Multiplication</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fast matrix multiplication using divide and conquer with only 7 recursive calls
          </p>
        </div>

        {/* Interactive Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Matrix Multiplication Simulator</h2>
            <div className="flex gap-4">
              <button
                onClick={generateRandomMatrices}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Random Matrices
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {showComparison ? "Hide" : "Show"} Comparison
              </button>
            </div>
          </div>

          {/* Matrix Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <MatrixInput matrix={matrixA} title="Matrix A" isMatrixA={true} />
            <MatrixInput matrix={matrixB} title="Matrix B" isMatrixA={false} />
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleMultiply}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
            >
              Multiply Using Strassen&apos;s Algorithm
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <MatrixDisplay matrix={result.data} title="Result Matrix (A × B)" />
              
              {showComparison && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Algorithm Comparison</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Strassen&apos;s Algorithm</h4>
                      <MatrixDisplay matrix={result.data} title="" />
                      <p className="text-sm mt-2">Time: O(n^2.807), Multiplications: 7 per level</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Traditional Algorithm</h4>
                      <MatrixDisplay matrix={traditionalMultiply(matrixA.data, matrixB.data)} title="" />
                      <p className="text-sm mt-2">Time: O(n^3), Multiplications: 8 per level</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps Visualization */}
              {steps.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Algorithm Steps</h3>
                  <div className="space-y-4">
                    {steps.slice(-4).map((step, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-purple-600">{step.operation}</h4>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                          </div>
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Understanding Strassen&apos;s Algorithm</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4">Key Concepts</h3>
              <div className="space-y-3">
                <p className="text-gray-700">{educationalContent.introduction}</p>
                <div>
                  <h4 className="font-semibold mb-2">Algorithm Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {educationalContent.steps.map((step, index) => (
                      <li key={index} className="text-gray-600 text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4">Complexity Analysis</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Complexity</h4>
                  <p className="text-gray-700">{educationalContent.complexity.time}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Space Complexity</h4>
                  <p className="text-gray-700">{educationalContent.complexity.space}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">Advantages</h3>
              <ul className="space-y-2">
                {educationalContent.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700 text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">Disadvantages</h3>
              <ul className="space-y-2">
                {educationalContent.disadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700 text-sm">{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Exam Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Exam Preparation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Common Questions</h3>
              <ul className="space-y-2">
                {examInfo.commonQuestions.map((question, index) => (
                  <li key={index} className="text-gray-700 text-sm">• {question}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Study Tips</h3>
              <ul className="space-y-2">
                {examInfo.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700 text-sm">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">{examInfo.examRelevance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
