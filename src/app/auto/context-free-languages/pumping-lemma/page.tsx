"use client";

import { useState } from "react";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PumpingExample {
  language: string;
  description: string;
  isContextFree: boolean;
  proof: string[];
}

export default function CFLPumpingLemma() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [customLanguage, setCustomLanguage] = useState<string>("");
  const [pumpingLength, setPumpingLength] = useState<number>(3);
  const [testString, setTestString] = useState<string>("");
  const [proofSteps, setProofSteps] = useState<string[]>([]);
  const [decomposition, setDecomposition] = useState<{u: string, v: string, x: string, y: string, z: string} | null>(null);

  const examples: PumpingExample[] = [
    {
      language: "L = {a^n b^n c^n | n ≥ 0}",
      description: "Equal numbers of a's, b's, and c's",
      isContextFree: false,
      proof: [
        "Assume L is context-free. Let p be the pumping length.",
        "Choose s = a^p b^p c^p. Clearly |s| ≥ p and s ∈ L.",
        "By pumping lemma, s = uvxyz where |vxy| ≤ p, |vy| > 0.",
        "Since |vxy| ≤ p, vxy contains at most 2 different symbols.",
        "Case 1: vxy contains only a's and b's",
        "  Pumping up: uv²xy²z has more a's and b's but same c's → not in L",
        "Case 2: vxy contains only b's and c's", 
        "  Pumping up: uv²xy²z has more b's and c's but same a's → not in L",
        "Case 3: vxy contains only one type of symbol",
        "  Pumping up increases only one symbol type → not in L",
        "All cases lead to contradiction. Therefore L is not context-free."
      ]
    },
    {
      language: "L = {a^i b^j c^k | i = j or j = k}",
      description: "Either equal a's and b's, or equal b's and c's",
      isContextFree: true,
      proof: [
        "This language IS context-free.",
        "We can construct a CFG: S → S₁ | S₂",
        "S₁ → AB (for i = j case)",
        "A → aAb | ε",
        "B → cB | ε", 
        "S₂ → AC (for j = k case)",
        "A → aA | ε",
        "C → bCc | ε",
        "This grammar generates exactly the language L."
      ]
    },
    {
      language: "L = {ww | w ∈ {a,b}*}",
      description: "Strings that are concatenation of a string with itself",
      isContextFree: false,
      proof: [
        "Assume L is context-free. Let p be the pumping length.",
        "Choose s = a^p b^p a^p b^p. Clearly |s| = 4p ≥ p and s ∈ L.",
        "By pumping lemma, s = uvxyz where |vxy| ≤ p, |vy| > 0.",
        "Since |vxy| ≤ p, vxy is entirely within first a^p b^p.",
        "Pumping up: uv²xy²z changes only the first half.",
        "The result is no longer of form ww.",
        "Contradiction. Therefore L is not context-free."
      ]
    },
    {
      language: "L = {a^n b^m c^n d^m | n,m ≥ 0}",
      description: "Matching a's with c's and b's with d's",
      isContextFree: false,
      proof: [
        "Assume L is context-free. Let p be the pumping length.",
        "Choose s = a^p b^p c^p d^p.",
        "By pumping lemma, s = uvxyz where |vxy| ≤ p, |vy| > 0.",
        "Since |vxy| ≤ p, vxy spans at most 2 symbol types.",
        "If vxy doesn't include both a and c, pumping destroys a-c balance.",
        "If vxy doesn't include both b and d, pumping destroys b-d balance.",
        "Since |vxy| ≤ p, it cannot include all four symbol types.",
        "Contradiction. Therefore L is not context-free."
      ]
    }
  ];

  const applyPumpingLemma = () => {
    const example = examples.find(ex => ex.language === selectedLanguage);
    if (!example) {
      setProofSteps(["Please select a language to analyze."]);
      return;
    }

    const steps: string[] = [];
    
    steps.push(`Pumping Lemma Analysis for: ${example.language}`);
    steps.push(`Description: ${example.description}`);
    steps.push("");
    
    steps.push("Pumping Lemma for Context-Free Languages:");
    steps.push("If L is context-free, then ∃ pumping length p such that");
    steps.push("∀ string s ∈ L with |s| ≥ p, ∃ decomposition s = uvxyz where:");
    steps.push("1. |vxy| ≤ p");
    steps.push("2. |vy| > 0"); 
    steps.push("3. ∀ i ≥ 0: uv^i xy^i z ∈ L");
    steps.push("");
    
    if (example.isContextFree) {
      steps.push("Result: This language IS context-free.");
      steps.push("Proof approach:");
      steps.push(...example.proof);
    } else {
      steps.push("Result: This language is NOT context-free.");
      steps.push("Proof by contradiction:");
      steps.push(...example.proof);
    }

    setProofSteps(steps);
  };

  const testPumpingWithString = () => {
    if (!testString) {
      setProofSteps(["Please enter a test string."]);
      return;
    }

    const steps: string[] = [];
    const s = testString;
    const p = pumpingLength;

    steps.push(`Testing string: s = "${s}"`);
    steps.push(`Pumping length: p = ${p}`);
    steps.push(`String length: |s| = ${s.length}`);
    steps.push("");

    if (s.length < p) {
      steps.push(`Since |s| < p, the pumping lemma doesn't apply to this string.`);
      steps.push(`Choose a longer string with |s| ≥ p.`);
      setProofSteps(steps);
      return;
    }

    steps.push("By the pumping lemma, s must be decomposable as s = uvxyz where:");
    steps.push("1. |vxy| ≤ p");
    steps.push("2. |vy| > 0");
    steps.push("3. ∀ i ≥ 0: uv^i xy^i z ∈ L");
    steps.push("");

    // Try to find a valid decomposition (for demonstration)
    // This is a simplified example - real pumping lemma proofs require careful analysis
    
    const possibleDecompositions: Array<{
      u: string;
      v: string;
      x: string;
      y: string;
      z: string;
    }> = [];
    
    for (let vxyStart = 0; vxyStart <= Math.min(s.length - 1, p); vxyStart++) {
      for (let vxyLength = 1; vxyLength <= Math.min(p, s.length - vxyStart); vxyLength++) {
        for (let vStart = vxyStart; vStart < vxyStart + vxyLength; vStart++) {
          for (let vLength = 0; vLength <= vxyStart + vxyLength - vStart; vLength++) {
            for (let yStart = vStart + vLength; yStart < vxyStart + vxyLength; yStart++) {
              for (let yLength = 1; yLength <= vxyStart + vxyLength - yStart; yLength++) {
                if (vLength + yLength > 0) { // |vy| > 0
                  const u = s.substring(0, vStart);
                  const v = s.substring(vStart, vStart + vLength);
                  const x = s.substring(vStart + vLength, yStart);
                  const y = s.substring(yStart, yStart + yLength);
                  const z = s.substring(yStart + yLength);
                  
                  possibleDecompositions.push({u, v, x, y, z});
                }
              }
            }
          }
        }
      }
    }

    if (possibleDecompositions.length > 0) {
      const decomp = possibleDecompositions[0]; // Take first valid decomposition
      steps.push("Example decomposition:");
      steps.push(`u = "${decomp.u}"`);
      steps.push(`v = "${decomp.v}"`);
      steps.push(`x = "${decomp.x}"`);
      steps.push(`y = "${decomp.y}"`);
      steps.push(`z = "${decomp.z}"`);
      steps.push("");
      steps.push("Verification:");
      steps.push(`|vxy| = |"${decomp.v}${decomp.x}${decomp.y}"| = ${decomp.v.length + decomp.x.length + decomp.y.length} ≤ ${p} ✓`);
      steps.push(`|vy| = |"${decomp.v}${decomp.y}"| = ${decomp.v.length + decomp.y.length} > 0 ✓`);
      steps.push("");
      steps.push("Testing pumping:");
      steps.push(`i=0: uv^0 xy^0 z = u x z = "${decomp.u}${decomp.x}${decomp.z}"`);
      steps.push(`i=1: uv^1 xy^1 z = u v x y z = "${decomp.u}${decomp.v}${decomp.x}${decomp.y}${decomp.z}" (original)`);
      steps.push(`i=2: uv^2 xy^2 z = u v v x y y z = "${decomp.u}${decomp.v}${decomp.v}${decomp.x}${decomp.y}${decomp.y}${decomp.z}"`);
      
      setDecomposition(decomp);
    } else {
      steps.push("No valid decomposition found satisfying the constraints.");
    }

    setProofSteps(steps);
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Pumping Lemma for Context-Free Languages
      </h1>

      <EducationalInfo
        topic="Pumping Lemma for Context-Free Languages"
        description="Learn to use the pumping lemma to prove that certain languages are not context-free"
        theory={{
          definition: "If L is a context-free language, then there exists a pumping length p such that any string s ∈ L with |s| ≥ p can be divided into s = uvxyz satisfying specific conditions.",
          keyPoints: [
            "Used to prove languages are NOT context-free (proof by contradiction)",
            "Conditions: |vxy| ≤ p, |vy| > 0, and uv^i xy^i z ∈ L for all i ≥ 0",
            "The pumping length p depends on the grammar's structure",
            "Choose a strategic string that leads to contradiction when pumped",
            "Cannot be used to prove a language IS context-free"
          ],
          applications: [
            "Proving language hierarchy separations",
            "Theoretical computer science research",
            "Compiler theory and parsing limitations",
            "Formal language classification"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["Pumping Lemma for CFL", "Non-Context-Free Languages", "Language Hierarchy"],
          marks: "10-15 marks",
          commonQuestions: [
            "Use pumping lemma to prove L is not context-free",
            "State the pumping lemma for context-free languages",
            "Apply pumping lemma to specific languages",
            "Explain why certain languages fail the pumping lemma"
          ],
          examTips: [
            "Choose strings carefully - they should expose the contradiction",
            "Consider all possible cases for where v and y can be located",
            "Remember |vxy| ≤ p constraint limits possible locations",
            "Show that pumping destroys the language membership"
          ]
        }}
        algorithm={{
          steps: [
            "To prove L is not context-free using pumping lemma:",
            "1. Assume L is context-free with pumping length p",
            "2. Choose a string s ∈ L with |s| ≥ p strategically",
            "3. Consider all possible decompositions s = uvxyz satisfying constraints",
            "4. For each case, show that pumping (uv^i xy^i z for some i ≠ 1) ∉ L",
            "5. Since all cases fail, L cannot be context-free"
          ],
          complexity: {
            time: "Depends on proof complexity - typically manual analysis",
            space: "O(|s|) for string storage during analysis"
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Language Selection and Analysis */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Language Analysis</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Select a Language to Analyze
            </label>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-md bg-white text-black border-gray-300"
            >
              <option value="">Choose a language...</option>
              {examples.map((example, index) => (
                <option key={index} value={example.language}>
                  {example.language}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Or Enter Custom Language Description
            </label>
            <Input
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              placeholder="e.g., L = {a^n b^n c^n | n ≥ 0}"
              className="text-black bg-white"
            />
          </div>

          <Button onClick={applyPumpingLemma} className="w-full mb-4">
            Apply Pumping Lemma
          </Button>

          <hr className="my-4" />

          <h3 className="text-lg font-medium mb-3 text-black">Test String Decomposition</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Test String
            </label>
            <Input
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="e.g., aaabbbccc"
              className="text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Pumping Length (p)
            </label>
            <Input
              type="number"
              value={pumpingLength}
              onChange={(e) => setPumpingLength(parseInt(e.target.value) || 3)}
              min="1"
              className="text-black bg-white"
            />
          </div>

          <Button onClick={testPumpingWithString} variant="outline" className="w-full">
            Test Decomposition
          </Button>
        </Card>

        {/* Proof Steps */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Proof Steps</h2>
          
          {proofSteps.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                {proofSteps.join('\n')}
              </pre>
            </div>
          ) : (
            <p className="text-black">Select a language and click &quot;Apply Pumping Lemma&quot; to see the proof.</p>
          )}
        </Card>
      </div>

      {/* String Decomposition Visualization */}
      {decomposition && (
        <Card className="p-6 mb-8 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">String Decomposition Visualization</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <span className="px-3 py-2 bg-red-100 text-red-800 rounded font-mono border">
                u: &quot;{decomposition.u}&quot;
              </span>
              <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded font-mono border">
                v: &quot;{decomposition.v}&quot;
              </span>
              <span className="px-3 py-2 bg-green-100 text-green-800 rounded font-mono border">
                x: &quot;{decomposition.x}&quot;
              </span>
              <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded font-mono border">
                y: &quot;{decomposition.y}&quot;
              </span>
              <span className="px-3 py-2 bg-purple-100 text-purple-800 rounded font-mono border">
                z: &quot;{decomposition.z}&quot;
              </span>
            </div>
            
            <p className="text-center text-black mb-4">
              Original string: {decomposition.u}<span className="text-blue-600">{decomposition.v}</span><span className="text-green-600">{decomposition.x}</span><span className="text-yellow-600">{decomposition.y}</span>{decomposition.z}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium text-black mb-2">i = 0 (Pump Down)</h4>
              <p className="font-mono text-sm text-black">
                {decomposition.u}<span className="text-green-600">{decomposition.x}</span>{decomposition.z}
              </p>
              <p className="text-xs text-gray-600 mt-1">Removes v and y</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium text-black mb-2">i = 1 (Original)</h4>
              <p className="font-mono text-sm text-black">
                {decomposition.u}<span className="text-blue-600">{decomposition.v}</span><span className="text-green-600">{decomposition.x}</span><span className="text-yellow-600">{decomposition.y}</span>{decomposition.z}
              </p>
              <p className="text-xs text-gray-600 mt-1">Original string</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium text-black mb-2">i = 2 (Pump Up)</h4>
              <p className="font-mono text-sm text-black">
                {decomposition.u}<span className="text-blue-600">{decomposition.v}</span><span className="text-blue-600">{decomposition.v}</span><span className="text-green-600">{decomposition.x}</span><span className="text-yellow-600">{decomposition.y}</span><span className="text-yellow-600">{decomposition.y}</span>{decomposition.z}
              </p>
              <p className="text-xs text-gray-600 mt-1">Duplicates v and y</p>
            </div>
          </div>
        </Card>
      )}

      {/* Language Examples Summary */}
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Language Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-black">{example.language}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  example.isContextFree 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {example.isContextFree ? "Context-Free" : "Not Context-Free"}
                </span>
              </div>
              <p className="text-sm text-black mb-3">{example.description}</p>
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  {example.isContextFree ? "Show CFG" : "Show proof outline"}
                </summary>
                <div className="mt-2 text-black">
                  {example.proof.slice(0, 3).map((step, i) => (
                    <p key={i} className="mb-1">• {step}</p>
                  ))}
                  {example.proof.length > 3 && <p className="text-gray-600">...</p>}
                </div>
              </details>
            </div>
          ))}
        </div>
      </Card>

      <ExamResult
        title="Pumping Lemma for CFL"
        input={selectedLanguage || testString || "Language analysis"}
        result={proofSteps.length > 0}
        steps={proofSteps.map((step, index) => ({
          stepNumber: index + 1,
          description: step,
          explanation: step
        }))}
        finalAnswer={proofSteps.length > 0 ? 
          (selectedLanguage ? 
            (examples.find(ex => ex.language === selectedLanguage)?.isContextFree ? 
              "Language is context-free" : 
              "Language is not context-free") : 
            "Analysis completed") : 
          "No analysis performed"
        }
        examFormat={{
          question: "Use the pumping lemma to determine if the given language is context-free.",
          solution: proofSteps,
          conclusion: "The pumping lemma provides a systematic way to prove that certain languages are not context-free.",
          marks: 15
        }}
      />
    </div>
  );
}
