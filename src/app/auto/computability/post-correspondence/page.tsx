"use client";

import EducationalInfo from '@/components/EducationalInfo';
import ExamResult from '@/components/ExamResult';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PostCorrespondenceProblem() {
  // Add light/dark mode handling
  React.useEffect(() => {
    // Set explicit background color on the body to prevent dark background
    document.body.classList.add('bg-white');
    
    return () => {
      document.body.classList.remove('bg-white');
    };
  }, []);
  
  // State for PCP instance
  const [dominoPairs, setDominoPairs] = useState<Array<[string, string]>>([
    ["a", "ab"],
    ["b", "ca"],
    ["ca", "a"]
  ]);
  const [newDominoTop, setNewDominoTop] = useState<string>("");
  const [newDominoBottom, setNewDominoBottom] = useState<string>("");
  const [solutionPath, setSolutionPath] = useState<number[]>([]);
  const [topString, setTopString] = useState<string>("");
  const [bottomString, setBottomString] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchLimit, setSearchLimit] = useState<number>(10);
  
  // Add a new domino pair
  const addDominoPair = () => {
    if (newDominoTop && newDominoBottom) {
      setDominoPairs([...dominoPairs, [newDominoTop, newDominoBottom]]);
      setNewDominoTop("");
      setNewDominoBottom("");
    }
  };
  
  // Remove a domino pair
  const removeDominoPair = (index: number) => {
    setDominoPairs(dominoPairs.filter((_, i) => i !== index));
  };
  
  // Solve the PCP (with limited search depth)
  const solvePCP = () => {
    setSolutionPath([]);
    setTopString("");
    setBottomString("");
    setStatus("");
    
    // Queue for BFS search
    // Each entry is [path, topString, bottomString]
    const queue: Array<[number[], string, string]> = [];
    
    // Initialize with all possible starting dominoes
    for (let i = 0; i < dominoPairs.length; i++) {
      queue.push([[i], dominoPairs[i][0], dominoPairs[i][1]]);
    }
    
    // Set to keep track of explored states to avoid cycles
    const visited = new Set<string>();
    
    // BFS search
    while (queue.length > 0) {
      const [path, top, bottom] = queue.shift()!;
      
      // Check if this state has been visited
      const stateKey = `${path.length}|${top}|${bottom}`;
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);
      
      // Check if we have a match
      if (top === bottom && top.length > 0) {
        setSolutionPath(path);
        setTopString(top);
        setBottomString(bottom);
        setStatus("Solution found!");
        return;
      }
      
      // Check if we've reached the search limit
      if (path.length >= searchLimit) {
        continue;
      }
      
      // Try adding each domino
      for (let i = 0; i < dominoPairs.length; i++) {
        const newTop = top + dominoPairs[i][0];
        const newBottom = bottom + dominoPairs[i][1];
        
        // Avoid paths where one string will never be able to match the other
        const minLength = Math.min(newTop.length, newBottom.length);
        if (newTop.substring(0, minLength) !== newBottom.substring(0, minLength)) {
          continue;
        }
        
        queue.push([[...path, i], newTop, newBottom]);
      }
    }
    
    setStatus("No solution found within search limit. Try increasing the limit or a different set of dominoes.");
  };
  
  // Clear the current PCP instance
  const clearPCP = () => {
    setDominoPairs([]);
    setSolutionPath([]);
    setTopString("");
    setBottomString("");
    setStatus("");
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Post Correspondence Problem (PCP)
      </h1>

      <EducationalInfo 
        topic="Post Correspondence Problem"
        description="Learn about the Post Correspondence Problem (PCP) and its importance in computability theory"
        theory={{
          definition: "The Post Correspondence Problem (PCP) is an undecidable problem in theoretical computer science, first introduced by Emil Post in 1946.",
          keyPoints: [
            "Input: A finite set of domino pairs (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ), where each xᵢ and yᵢ is a non-empty string",
            "Question: Does there exist a sequence of indices i₁, i₂, ..., iₖ such that x_i₁x_i₂...x_iₖ = y_i₁y_i₂...y_iₖ?",
            "The general PCP is undecidable",
            "PCP is often used in reductions to prove other problems undecidable"
          ],
          applications: [
            "Proving undecidability of various problems",
            "Computational linguistics",
            "Formal verification"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["Theory of Computation", "Undecidability", "Computability Theory"],
          marks: "10-15 marks",
          commonQuestions: [
            "Solve the given PCP instance",
            "Use PCP to prove undecidability of problem X",
            "Explain the relation between PCP and the Halting Problem"
          ],
          examTips: [
            "Remember that PCP is undecidable in general",
            "For simple instances, try systematic enumeration",
            "Know how to reduce from PCP to other problems"
          ]
        }}
        algorithm={{
          steps: [
            "Represent each domino pair as (top string, bottom string)",
            "Try different sequences of dominoes",
            "For each sequence, concatenate the top strings and bottom strings",
            "Check if the top and bottom concatenated strings match",
            "If they match, we have found a solution"
          ],
          complexity: {
            time: "Undecidable (no algorithm can solve all instances)",
            space: "Exponential for bounded search"
          }
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">
            PCP Instance
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Add New Domino Pair
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input 
                value={newDominoTop} 
                onChange={(e) => setNewDominoTop(e.target.value)} 
                placeholder="Top string"
                className="text-black bg-white border-gray-300"
              />
              <Input 
                value={newDominoBottom} 
                onChange={(e) => setNewDominoBottom(e.target.value)} 
                placeholder="Bottom string"
                className="text-black bg-white border-gray-300"
              />
            </div>
            <Button 
              onClick={addDominoPair} 
              className="w-full"
            >
              Add Domino
            </Button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Current Domino Pairs
            </label>
            <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
              {dominoPairs.map((pair, index) => (
                <div key={index} className="flex items-center mb-2 text-black">
                  <div className="border rounded-md p-2 flex-grow mr-2">
                    <div className="border-b pb-1">{pair[0]}</div>
                    <div className="pt-1">{pair[1]}</div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeDominoPair(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {dominoPairs.length === 0 && (
                <p className="text-black text-center py-2">
                  No domino pairs added yet.
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Depth Limit
            </label>
            <Input 
              type="number"
              value={searchLimit} 
              onChange={(e) => setSearchLimit(parseInt(e.target.value) || 10)} 
              min="1"
              max="15"
              className="text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 mt-1">
              Limits the search depth to avoid excessive computation. Higher values may slow down the browser.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={solvePCP} 
              className="flex-1"
            >
              Solve PCP
            </Button>
            <Button 
              onClick={clearPCP} 
              variant="outline"
            >
              Clear All
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">
            PCP Solution
          </h2>
          
          {status && (
            <div className={`p-3 rounded-md mb-4 ${
              status.includes("Solution found") 
                ? "bg-green-100 text-green-800" 
                : "bg-amber-100 text-amber-800"
            }`}>
              {status}
            </div>
          )}
          
          {solutionPath.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-black">
                Solution Sequence:
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {solutionPath.map((index, position) => (
                  <div 
                    key={position} 
                    className="border rounded-md p-2 text-center text-black"
                  >
                    <div className="font-medium">{position + 1}</div>
                    <div className="border-b border-dashed pb-1">{dominoPairs[index][0]}</div>
                    <div className="pt-1">{dominoPairs[index][1]}</div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-medium mb-2 text-black">
                Resulting Strings:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-2">
                  <span className="font-medium text-black">Top: </span>
                  <span className="text-black">{topString}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Bottom: </span>
                  <span className="text-black">{bottomString}</span>
                </div>
              </div>
            </div>
          )}
          
          {!status && (
            <div className="text-center py-10 text-black">
              Click &quot;Solve PCP&quot; to find a solution for the current domino pairs.
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-2 text-blue-800">
              Remember:
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              The Post Correspondence Problem is undecidable in general. This simulator uses a breadth-first search with a depth limit, so it may not find solutions that require more steps than the limit allows.
            </p>
          </div>
        </Card>
      </div>
      
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">
          PCP Examples and Variants
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <div>
            <h3 className="font-medium mb-2">Classic Example (Has Solution):</h3>
            <ul className="list-disc list-inside">
              <li>(a, ab)</li>
              <li>(b, ca)</li>
              <li>(ca, a)</li>
            </ul>
            <p className="mt-2">Solution: [1, 2, 3] produces &quot;abca&quot; on both top and bottom.</p>
            
            <h3 className="font-medium mt-4 mb-2">Simple Unsolvable Instance:</h3>
            <ul className="list-disc list-inside">
              <li>(a, aa)</li>
              <li>(b, b)</li>
            </ul>
            <p className="mt-2">
              No solution exists because any sequence will always have more a&apos;s on the bottom than on the top.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">PCP Variants:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Bounded PCP</strong>: Ask if there&apos;s a solution with at most k dominoes.</li>
              <li><strong>Modified PCP</strong>: First and last dominoes are fixed.</li>
              <li><strong>Marked PCP</strong>: All dominoes have special markers at certain positions.</li>
              <li><strong>2-PCP</strong>: Only two domino pairs are allowed (decidable!).</li>
            </ol>
            
            <h3 className="font-medium mt-4 mb-2">Complexity:</h3>
            <ul className="list-disc list-inside">
              <li>General PCP: Undecidable</li>
              <li>Bounded PCP: NP-complete</li>
              <li>2-PCP: Decidable in polynomial time</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Undecidability Proof Sketch
        </h2>
        
        <div className="text-gray-900 dark:text-white">
          <p className="mb-4">
            The Post Correspondence Problem is proven undecidable by reduction from the Halting Problem for Turing machines.
          </p>
          
          <h3 className="font-medium mb-2">Reduction Steps:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Given a Turing machine M and input w, construct a PCP instance.</li>
            <li>Create domino pairs that encode:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>The initial configuration of M on input w</li>
                <li>Legal moves of M according to its transition function</li>
                <li>A way to check for the accepting state</li>
              </ul>
            </li>
            <li>Design the encoding such that a solution exists if and only if M halts on input w.</li>
            <li>Since determining if M halts on w is undecidable, determining if the constructed PCP instance has a solution must also be undecidable.</li>
          </ol>
          
          <h3 className="font-medium mt-4 mb-2">Implications:</h3>
          <p>
            This reduction establishes the PCP as one of the simplest undecidable problems, which makes it a useful tool for proving other problems undecidable through further reductions.
          </p>
        </div>
      </Card>

      <ExamResult
        title="Post Correspondence Problem Example"
        input="Domino pairs: (a, ab), (b, ca), (ca, a)"
        result={true}
        steps={[
          {
            stepNumber: 1,
            description: "Try first domino",
            currentState: "Start",
            input: "(a, ab)",
            transition: "Add domino 1",
            explanation: "Top: a, Bottom: ab (not equal)"
          },
          {
            stepNumber: 2,
            description: "Add second domino",
            currentState: "After domino 1",
            input: "(b, ca)",
            transition: "Add domino 2",
            explanation: "Top: a+b = ab, Bottom: ab+ca = abca (not equal)"
          },
          {
            stepNumber: 3,
            description: "Add third domino",
            currentState: "After dominos 1,2",
            input: "(ca, a)",
            transition: "Add domino 3",
            explanation: "Top: ab+ca = abca, Bottom: abca+a = abca (equal!)"
          }
        ]}
        finalAnswer="The PCP instance has a solution: the sequence [1, 2, 3] produces 'abca' for both top and bottom strings."
        examFormat={{
          question: "Solve the following Post Correspondence Problem instance: domino pairs (a, ab), (b, ca), (ca, a). Find a sequence of dominoes that produces the same string on top and bottom, or prove that no such sequence exists.",
          solution: [
            "1. Start with the first domino (a, ab): Top = a, Bottom = ab",
            "2. Add the second domino (b, ca): Top = ab, Bottom = abca",
            "3. Add the third domino (ca, a): Top = abca, Bottom = abca",
            "4. Since top and bottom strings match, we have found a solution"
          ],
          conclusion: "The sequence [1, 2, 3] is a solution to the given PCP instance, resulting in the string 'abca' for both top and bottom.",
          marks: 10
        }}
      />
    </div>
  );
}
