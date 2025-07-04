"use client";

import EducationalInfo from '@/components/EducationalInfo';
import ExamResult from '@/components/ExamResult';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Undecidability() {
  // Add light/dark mode handling
  React.useEffect(() => {
    // Set explicit background color on the body to prevent dark background
    document.body.classList.add('bg-white');
    
    return () => {
      document.body.classList.remove('bg-white');
    };
  }, []);
  
  // State for Turing machine halting problem
  const [tmDescription, setTmDescription] = useState<string>(`
// Turing Machine that checks if input has equal number of 0s and 1s
q0 0 -> q1 X R
q0 1 -> q2 Y R
q0 B -> q_accept B R

q1 0 -> q1 0 R
q1 1 -> q3 Y R
q1 B -> q_reject B R
q1 X -> q1 X R
q1 Y -> q1 Y R

q2 0 -> q3 X R
q2 1 -> q2 1 R
q2 B -> q_reject B R
q2 X -> q2 X R
q2 Y -> q2 Y R

q3 0 -> q1 0 R
q3 1 -> q2 1 R
q3 B -> q0 B L
q3 X -> q3 X R
q3 Y -> q3 Y R
  `);
  const [inputString, setInputString] = useState<string>("0101");
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
  const [simulationStatus, setSimulationStatus] = useState<string>("");
  const [simulationLimit, setSimulationLimit] = useState<number>(100);
  
  // State for reduction demonstration
  const [problem1, setProblem1] = useState<string>("Halting Problem");
  const [problem2, setProblem2] = useState<string>("Equivalence of TMs");
  const [reductionExplanation, setReductionExplanation] = useState<string>("");

  // Simulate the halting problem
  const simulateHaltingProblem = () => {
    // This is a simplified simulation to illustrate the concept
    // In reality, we can't solve the halting problem in general
    
    // Clear previous results
    setSimulationSteps([]);
    setSimulationStatus("");
    
    // Parse the TM description (very simplified)
    const transitions: Record<string, Record<string, [string, string, string]>> = {};
    const lines = tmDescription.trim().split('\n');
    
    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('//')) continue;
      
      const match = line.match(/^(\w+)\s+(\w|\B)\s+->\s+(\w+)\s+(\w|\B)\s+(\w)$/);
      if (!match) {
        setSimulationStatus("Error: Invalid transition format in line: " + line);
        return;
      }
      
      const [, currentState, readSymbol, nextState, writeSymbol, moveDirection] = match;
      
      if (!transitions[currentState]) {
        transitions[currentState] = {};
      }
      
      transitions[currentState][readSymbol] = [nextState, writeSymbol, moveDirection];
    }
    
    // Simulate the TM on the input
    const tape = inputString.split('');
    let headPosition = 0;
    let currentState = "q0";
    const steps: string[] = [];
    
    for (let step = 0; step < simulationLimit; step++) {
      // Extend the tape if needed
      while (headPosition >= tape.length) {
        tape.push('B');  // 'B' represents blank
      }
      while (headPosition < 0) {
        tape.unshift('B');
        headPosition = 0;
      }
      
      const currentSymbol = tape[headPosition];
      
      // Record the current configuration
      const tapeStr = tape.join('');
      const pointerStr = ' '.repeat(headPosition) + '^';
      steps.push(`Step ${step}: State = ${currentState}, Tape = ${tapeStr}\n${pointerStr}`);
      
      // Check if we've reached an accepting or rejecting state
      if (currentState === "q_accept") {
        steps.push("Machine halted in accepting state.");
        setSimulationSteps(steps);
        setSimulationStatus("Halted: Accepted");
        return;
      }
      
      if (currentState === "q_reject") {
        steps.push("Machine halted in rejecting state.");
        setSimulationSteps(steps);
        setSimulationStatus("Halted: Rejected");
        return;
      }
      
      // Find the transition
      if (!transitions[currentState] || !transitions[currentState][currentSymbol]) {
        steps.push(`No transition defined for state ${currentState} and symbol ${currentSymbol}.`);
        setSimulationSteps(steps);
        setSimulationStatus("Error: No transition defined");
        return;
      }
      
      // Apply the transition
      const [nextState, writeSymbol, moveDirection] = transitions[currentState][currentSymbol];
      tape[headPosition] = writeSymbol;
      currentState = nextState;
      
      if (moveDirection === 'R') {
        headPosition++;
      } else if (moveDirection === 'L') {
        headPosition--;
      }
    }
    
    // If we reach here, we've exceeded the step limit
    steps.push(`Exceeded maximum simulation steps (${simulationLimit}).`);
    steps.push("The machine may run forever, or may halt after more steps.");
    steps.push("This illustrates the undecidability of the halting problem.");
    setSimulationSteps(steps);
    setSimulationStatus("Limit Exceeded");
  };

  // Show reduction example
  const showReduction = () => {
    if (problem1 === "Halting Problem" && problem2 === "Equivalence of TMs") {
      setReductionExplanation(`
        # Reduction from Halting Problem to Equivalence of TMs
        
        We want to show that the problem of determining if two Turing machines are equivalent is undecidable.
        
        ## Reduction:
        
        1. Given a Turing machine M and input w, we construct two TMs:
           - TM₁: Always accepts (loops forever on a separate track)
           - TM₂: Simulates M on w, then accepts if M halts on w
        
        2. TM₁ and TM₂ are equivalent if and only if M does not halt on w
        
        3. If we could decide equivalence of TM₁ and TM₂, we could decide if M halts on w
        
        4. Since the halting problem is undecidable, the equivalence problem must be undecidable too
        
        This is a many-one reduction (or mapping reduction), written as:
        HALT ≤ₘ EQ_TM
      `);
    } else if (problem1 === "Halting Problem" && problem2 === "TM Emptiness Problem") {
      setReductionExplanation(`
        # Reduction from Halting Problem to TM Emptiness Problem
        
        We want to show that the problem of determining if a Turing machine's language is empty is undecidable.
        
        ## Reduction:
        
        1. Given a Turing machine M and input w, we construct a new TM M':
           - M' accepts input x if and only if x = w and M halts on w
        
        2. The language of M', L(M'), is empty if and only if M doesn't halt on w
        
        3. If we could decide emptiness of L(M'), we could decide if M halts on w
        
        4. Since the halting problem is undecidable, the emptiness problem must be undecidable too
        
        This reduction demonstrates that the emptiness problem for Turing machines is undecidable.
      `);
    } else if (problem1 === "Halting Problem" && problem2 === "Post Correspondence Problem") {
      setReductionExplanation(`
        # Reduction from Halting Problem to Post Correspondence Problem
        
        We want to show that the Post Correspondence Problem (PCP) is undecidable.
        
        ## Reduction:
        
        1. Given a Turing machine M and input w, we construct a PCP instance:
           - The domino pairs encode the computation history of M on w
           - The first domino represents the initial configuration
           - Subsequent dominoes represent valid transitions of M
        
        2. The PCP instance has a solution if and only if M halts on w
        
        3. If we could decide the PCP, we could decide if M halts on w
        
        4. Since the halting problem is undecidable, the PCP must be undecidable too
        
        This is a more complex reduction but shows the fundamental relationship between
        computational problems and the PCP.
      `);
    } else {
      setReductionExplanation(`
        # Reduction from ${problem1} to ${problem2}
        
        To demonstrate that ${problem2} is undecidable, we can reduce ${problem1} to it.
        
        ## General Reduction Approach:
        
        1. Start with an instance of ${problem1}, which we know is undecidable
        
        2. Transform this instance into an instance of ${problem2} such that:
           - The answer to the original problem is "yes" if and only if
           - The answer to the transformed problem is "yes"
        
        3. If ${problem2} were decidable, we could use its decision procedure
           along with our transformation to decide ${problem1}
        
        4. Since ${problem1} is undecidable, ${problem2} must also be undecidable
        
        This is the essence of a reduction proof for undecidability.
      `);
    }
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Undecidability and the Halting Problem
      </h1>

      <EducationalInfo 
        topic="Undecidability in Computability Theory"
        description="Explore the limits of algorithmic problem solving through undecidability and the Halting Problem"
        theory={{
          definition: "In computability theory, a problem is undecidable if no algorithm can solve it for all possible inputs. The most famous undecidable problem is the Halting Problem.",
          keyPoints: [
            "The Halting Problem: Given a Turing machine M and input w, determine whether M halts on w",
            "Rice's Theorem: Any non-trivial semantic property of Turing machines is undecidable",
            "Common undecidable problems include TM equivalence, emptiness, and the Post Correspondence Problem",
            "Reductions allow us to prove new problems undecidable by reducing from known undecidable problems"
          ],
          applications: [
            "Formal verification of software",
            "Programming language design",
            "Theoretical computer science"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["Theory of Computation", "Computability Theory", "Turing Machines"],
          marks: "10-15 marks",
          commonQuestions: [
            "Prove that the Halting Problem is undecidable",
            "Show that problem X is undecidable using reduction",
            "Apply Rice's Theorem to prove undecidability",
            "Explain the relationship between different undecidable problems"
          ],
          examTips: [
            "Master the diagonalization argument for Halting Problem proofs",
            "Practice reduction proofs from Halting Problem to other problems",
            "Understand when and how to apply Rice's Theorem",
            "Be clear about the distinction between decidable and recognizable languages"
          ]
        }}
        algorithm={{
          steps: [
            "To prove undecidability via reduction:",
            "Start with a known undecidable problem A",
            "Construct a transformation from A to target problem B",
            "Show that A has a solution if and only if B has a solution",
            "Conclude that B must be undecidable, otherwise A would be decidable"
          ],
          complexity: {
            time: "Not applicable (no algorithm exists)",
            space: "Not applicable (no algorithm exists)"
          }
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Halting Problem Demonstration
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Turing Machine Description
            </label>
            <textarea 
              value={tmDescription} 
              onChange={(e) => setTmDescription(e.target.value)} 
              rows={10}
              className="w-full p-2 border rounded-md bg-white text-black font-mono"
              placeholder="Enter Turing machine transitions"
            />
            <p className="text-sm text-black mt-1">
              Format: state symbol → new_state new_symbol direction
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Input String
            </label>
            <Input 
              value={inputString} 
              onChange={(e) => setInputString(e.target.value)} 
              placeholder="e.g., 0101"
              className="text-black bg-white border-gray-300"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Simulation Step Limit
            </label>
            <Input 
              type="number"
              value={simulationLimit} 
              onChange={(e) => setSimulationLimit(parseInt(e.target.value) || 100)} 
              min="1"
              className="text-black bg-white border-gray-300"
            />
            <p className="text-sm text-black mt-1">
              To prevent infinite loops. In reality, we can&apos;t determine if a TM will halt!
            </p>
          </div>
          
          <Button 
            onClick={simulateHaltingProblem} 
            className="w-full mb-4"
          >
            Simulate Turing Machine
          </Button>
          
          {simulationStatus && (
            <div className={`p-3 rounded-md mb-4 ${
              simulationStatus.includes("Halted") 
                ? "bg-green-100 text-green-800" 
                : "bg-amber-100 text-amber-800"
            }`}>
              {simulationStatus}
            </div>
          )}
          
          {simulationSteps.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
              <h3 className="font-medium mb-2 text-black">Simulation Steps:</h3>
              {simulationSteps.map((step, index) => (
                <pre key={index} className="text-sm font-mono whitespace-pre-wrap text-black mb-2">
                  {step}
                </pre>
              ))}
            </div>
          )}
        </Card>
        
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Reductions Between Undecidable Problems
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Problem 1 (Known to be undecidable)
            </label>
            <select 
              value={problem1} 
              onChange={(e) => setProblem1(e.target.value)}
              className="w-full p-2 border rounded-md bg-white text-black border-gray-300"
            >
              <option value="Halting Problem">Halting Problem</option>
              <option value="Rice's Theorem">Rice&apos;s Theorem</option>
              <option value="Post Correspondence Problem">Post Correspondence Problem</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Problem 2 (To prove undecidable)
            </label>
            <select 
              value={problem2} 
              onChange={(e) => setProblem2(e.target.value)}
              className="w-full p-2 border rounded-md bg-white text-black border-gray-300"
            >
              <option value="Equivalence of TMs">Equivalence of TMs</option>
              <option value="TM Emptiness Problem">TM Emptiness Problem</option>
              <option value="Post Correspondence Problem">Post Correspondence Problem</option>
              <option value="Membership Problem for Unrestricted Grammars">Membership for Unrestricted Grammars</option>
              <option value="Tiling Problem">Tiling Problem</option>
            </select>
          </div>
          
          <Button 
            onClick={showReduction} 
            className="w-full mb-4"
          >
            Show Reduction
          </Button>
          
          {reductionExplanation && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
              <h3 className="font-medium mb-2 text-black">Reduction:</h3>
              <div className="prose prose-sm text-black">
                <pre className="whitespace-pre-wrap font-sans">{reductionExplanation}</pre>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Undecidability Proofs: The Diagonalization Argument
        </h2>
        
        <div className="text-black">
          <h3 className="font-medium mb-2 text-black">Cantor&apos;s Diagonalization Method:</h3>
          <p className="mb-4 text-black">
            The proof of the halting problem&apos;s undecidability uses a technique known as &quot;diagonalization,&quot; 
            first introduced by Georg Cantor to prove that the real numbers are uncountable.
          </p>
          
          <h3 className="font-medium mb-2 text-black">The Halting Problem Proof:</h3>
          <ol className="list-decimal list-inside space-y-2 text-black">
            <li>Assume there exists a Turing machine H that solves the halting problem:
              <ul className="list-disc list-inside ml-6 mt-1 text-black">
                <li>H(M,w) = 1 if M halts on input w</li>
                <li>H(M,w) = 0 if M runs forever on input w</li>
              </ul>
            </li>
            <li>We construct a new Turing machine D that:
              <ul className="list-disc list-inside ml-6 mt-1 text-black">
                <li>Takes a Turing machine description M as input</li>
                <li>Runs H(M,M) to determine if M halts when given itself as input</li>
                <li>If H(M,M) = 1 (meaning M halts on M), then D enters an infinite loop</li>
                <li>If H(M,M) = 0 (meaning M loops on M), then D halts</li>
              </ul>
            </li>
            <li>Now, we ask: What happens when D is run with its own description as input?</li>
            <li>If D halts on input D, then by its definition, D should loop forever</li>
            <li>If D loops forever on input D, then by its definition, D should halt</li>
            <li>This contradiction proves that H cannot exist</li>
          </ol>
          
          <h3 className="font-medium mt-6 mb-2 text-black">Visualization:</h3>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-2"></th>
                  <th className="border border-gray-400 p-2">Input TM₁</th>
                  <th className="border border-gray-400 p-2">Input TM₂</th>
                  <th className="border border-gray-400 p-2">Input TM₃</th>
                  <th className="border border-gray-400 p-2">...</th>
                  <th className="border border-gray-400 p-2">Input TM_D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">TM₁</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">TM₂</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">TM₃</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">...</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2">...</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold">TM_D</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">Halts</td>
                  <td className="border border-gray-400 p-2">Loops</td>
                  <td className="border border-gray-400 p-2">...</td>
                  <td className="border border-gray-400 p-2 bg-red-100 font-bold">???</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            The paradox occurs at the diagonal element marked with ???. If TM_D halts on itself, 
            it should loop by definition. If it loops on itself, it should halt by definition.
            This contradiction proves that H cannot exist.
          </p>
        </div>
      </Card>

      <ExamResult
        title="Halting Problem Proof"
        input="Prove that the Halting Problem is undecidable"
        result={true}
        steps={[
          {
            stepNumber: 1,
            description: "Set up the proof by contradiction",
            explanation: "Assume there exists a Turing machine H that solves the Halting Problem"
          },
          {
            stepNumber: 2,
            description: "Construct the diagonalizing machine D",
            currentState: "Definition",
            input: "TM description M",
            transition: "Create D",
            explanation: "D simulates H on input (M, M) and does the opposite: if H says M halts on M, then D loops forever; if H says M doesn't halt on M, then D halts"
          },
          {
            stepNumber: 3,
            description: "Create the paradox",
            currentState: "Running D",
            input: "D itself as input",
            transition: "Run D on D",
            explanation: "When D runs with itself as input, we get a contradiction: if D halts on D, then by definition D loops forever; if D loops on D, then by definition D halts"
          },
          {
            stepNumber: 4,
            description: "Reach contradiction",
            explanation: "This contradiction proves our assumption is wrong, and no such machine H can exist"
          }
        ]}
        finalAnswer="The Halting Problem is undecidable because assuming it is decidable leads to a logical contradiction through the diagonalization technique."
        examFormat={{
          question: "Prove that the Halting Problem is undecidable using the diagonalization method.",
          solution: [
            "1. Assume by contradiction that the Halting Problem is decidable.",
            "2. Then there exists a Turing machine H that takes as input a description of a TM M and an input w, and decides whether M halts on w.",
            "3. Using H, we can construct a new TM D that takes a TM description M and: (a) Simulates H on input (M, M), (b) If H says M halts on itself, D enters an infinite loop, (c) If H says M doesn't halt on itself, D halts immediately.",
            "4. Now consider what happens when we run D with its own description as input.",
            "5. If D halts on input D, then by our construction, H must have determined that D doesn't halt on D, which is a contradiction.",
            "6. If D doesn't halt on input D, then by our construction, H must have determined that D halts on D, which is also a contradiction."
          ],
          conclusion: "Since both possibilities lead to a contradiction, our initial assumption must be false. Therefore, the Halting Problem is undecidable - no algorithm can solve it for all possible inputs.",
          marks: 15
        }}
      />
    </div>
  );
}
