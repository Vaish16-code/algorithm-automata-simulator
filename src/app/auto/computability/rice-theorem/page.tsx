"use client";

import { useState } from "react";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertyExample {
  name: string;
  description: string;
  isTrivial: boolean;
  isSemantic: boolean;
  isUndecidable: boolean;
  explanation: string;
}

export default function RicesTheorem() {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [customProperty, setCustomProperty] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [proofSteps, setProofSteps] = useState<string[]>([]);

  const propertyExamples: PropertyExample[] = [
    {
      name: "Halting Problem",
      description: "Does TM M halt on input w?",
      isTrivial: false,
      isSemantic: true,
      isUndecidable: true,
      explanation: "This is a semantic property that depends on the behavior of the TM, not its description. Rice's theorem applies."
    },
    {
      name: "Emptiness",
      description: "Is L(M) = ∅? (Does M accept no strings?)",
      isTrivial: false,
      isSemantic: true,
      isUndecidable: true,
      explanation: "This property depends on the language recognized by M, making it semantic and undecidable."
    },
    {
      name: "Totality",
      description: "Is L(M) = Σ*? (Does M accept all strings?)",
      isTrivial: false,
      isSemantic: true,
      isUndecidable: true,
      explanation: "This is a non-trivial semantic property about the language of M."
    },
    {
      name: "Regularity",
      description: "Is L(M) a regular language?",
      isTrivial: false,
      isSemantic: true,
      isUndecidable: true,
      explanation: "Whether the language is regular depends on its structure, not the TM's description."
    },
    {
      name: "Finiteness",
      description: "Is L(M) finite?",
      isTrivial: false,
      isSemantic: true,
      isUndecidable: true,
      explanation: "The size of the language is a semantic property about behavior."
    },
    {
      name: "State Count",
      description: "Does M have exactly 5 states?",
      isTrivial: false,
      isSemantic: false,
      isUndecidable: false,
      explanation: "This is a syntactic property - we can count states from the description. Rice's theorem doesn't apply."
    },
    {
      name: "Alphabet Size",
      description: "Does M use a binary alphabet?",
      isTrivial: false,
      isSemantic: false,
      isUndecidable: false,
      explanation: "This is syntactic - we can examine the alphabet from the TM description."
    },
    {
      name: "Always Accept",
      description: "Does M accept every input? (L(M) = Σ*)",
      isTrivial: true,
      isSemantic: true,
      isUndecidable: false,
      explanation: "This is trivial because either all TMs have this property or none do (in this case, none)."
    },
    {
      name: "Always Reject",
      description: "Does M reject every input? (L(M) = ∅)",
      isTrivial: true,
      isSemantic: true,
      isUndecidable: false,
      explanation: "This is trivial - either all TMs have this property or none do."
    }
  ];

  const analyzeProperty = () => {
    const property = propertyExamples.find(p => p.name === selectedProperty);
    if (!property) {
      setAnalysisResult("Please select a property to analyze.");
      return;
    }

    const steps: string[] = [];
    steps.push(`Analysis of Property: "${property.name}"`);
    steps.push(`Description: ${property.description}`);
    steps.push("");

    // Step 1: Check if semantic
    steps.push("Step 1: Is this a semantic property?");
    if (property.isSemantic) {
      steps.push("✓ YES - This property depends on the language/behavior of the TM, not its description.");
    } else {
      steps.push("✗ NO - This is a syntactic property that can be determined from the TM description.");
      steps.push("Rice's Theorem does NOT apply to syntactic properties.");
      setProofSteps(steps);
      setAnalysisResult(`Property "${property.name}" is syntactic and therefore decidable.`);
      return;
    }
    steps.push("");

    // Step 2: Check if trivial
    steps.push("Step 2: Is this property trivial?");
    if (property.isTrivial) {
      steps.push("✓ YES - This property is satisfied by either all TMs or no TMs.");
      steps.push("Rice's Theorem does NOT apply to trivial properties.");
      steps.push("Trivial properties are decidable (answer is always the same).");
    } else {
      steps.push("✗ NO - This property is satisfied by some TMs but not others.");
      steps.push("This is a non-trivial semantic property.");
    }
    steps.push("");

    // Step 3: Apply Rice's Theorem
    steps.push("Step 3: Apply Rice's Theorem");
    if (property.isSemantic && !property.isTrivial) {
      steps.push("Since this is a non-trivial semantic property:");
      steps.push("• It concerns the language recognized by Turing machines");
      steps.push("• It is not satisfied by all TMs or no TMs");
      steps.push("• By Rice's Theorem, this property is UNDECIDABLE");
      steps.push("");
      steps.push("Rice's Theorem Proof Sketch:");
      steps.push("1. Assume the property P is decidable");
      steps.push("2. Use P to construct a decider for the Halting Problem");
      steps.push("3. Since Halting Problem is undecidable, we have a contradiction");
      steps.push("4. Therefore, P must be undecidable");
    } else if (property.isTrivial) {
      steps.push("This property is trivial, so it's decidable (always same answer).");
    } else {
      steps.push("This property is syntactic, so it's decidable by examining the TM description.");
    }

    setProofSteps(steps);
    setAnalysisResult(property.explanation);
  };

  const demonstrateRicesTheoremProof = () => {
    const steps: string[] = [];
    
    steps.push("Rice's Theorem - Complete Proof");
    steps.push("Theorem: Any non-trivial semantic property of Turing machines is undecidable.");
    steps.push("");
    
    steps.push("Definitions:");
    steps.push("• Semantic property: depends on the language L(M), not the description of M");
    steps.push("• Non-trivial: some TMs satisfy it, some don't (not all or none)");
    steps.push("• Trivial examples: ∅ (no TMs satisfy) or all TMs satisfy");
    steps.push("");
    
    steps.push("Proof by Contradiction:");
    steps.push("");
    
    steps.push("Step 1: Setup");
    steps.push("Let P be a non-trivial semantic property of TM languages.");
    steps.push("Assume P is decidable - there exists a TM R that decides P.");
    steps.push("R(⟨M⟩) = 1 if L(M) has property P, 0 otherwise");
    steps.push("");
    
    steps.push("Step 2: WLOG assumption");
    steps.push("WLOG, assume ∅ does not have property P.");
    steps.push("(If ∅ has property P, consider the complement property)");
    steps.push("Since P is non-trivial, ∃ language L that has property P.");
    steps.push("Let M_L be a TM such that L(M_L) = L.");
    steps.push("");
    
    steps.push("Step 3: Construct Halting Problem solver");
    steps.push("We'll construct TM S that decides the Halting Problem using R:");
    steps.push("");
    steps.push("S(⟨M⟩, w): // Decides if M halts on w");
    steps.push("1. Construct TM M' as follows:");
    steps.push("   M'(x):");
    steps.push("     a. Simulate M on input w");
    steps.push("     b. If M halts on w, simulate M_L on input x");
    steps.push("     c. Accept if M_L accepts x");
    steps.push("2. Run R on ⟨M'⟩");
    steps.push("3. If R accepts, return 1 (M halts on w)");
    steps.push("4. If R rejects, return 0 (M doesn't halt on w)");
    steps.push("");
    
    steps.push("Step 4: Analyze M's language");
    steps.push("Case 1: M halts on w");
    steps.push("  → M' simulates M_L completely");
    steps.push("  → L(M') = L(M_L) = L");
    steps.push("  → L has property P");
    steps.push("  → R(⟨M'⟩) = 1");
    steps.push("  → S returns 1 ✓");
    steps.push("");
    steps.push("Case 2: M doesn't halt on w");
    steps.push("  → M' never gets past step (a)");
    steps.push("  → M' never accepts any input");
    steps.push("  → L(M') = ∅");
    steps.push("  → ∅ doesn't have property P (by assumption)");
    steps.push("  → R(⟨M'⟩) = 0");
    steps.push("  → S returns 0 ✓");
    steps.push("");
    
    steps.push("Step 5: Contradiction");
    steps.push("S correctly decides the Halting Problem!");
    steps.push("But the Halting Problem is undecidable!");
    steps.push("Therefore, our assumption that P is decidable must be false.");
    steps.push("");
    
    steps.push("Conclusion:");
    steps.push("Any non-trivial semantic property of TM languages is undecidable. ∎");
    steps.push("");
    
    steps.push("Key Insight:");
    steps.push("The proof works by 'encoding' the halting problem into the language");
    steps.push("recognition problem through clever TM construction.");

    setProofSteps(steps);
    setAnalysisResult("Complete proof of Rice's Theorem demonstrated above.");
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Rice&apos;s Theorem
      </h1>

      <EducationalInfo
        topic="Rice's Theorem in Computability Theory"
        description="Understand the fundamental result about the undecidability of non-trivial semantic properties of Turing machines"
        theory={{
          definition: "Rice's Theorem states that any non-trivial semantic property of the language recognized by Turing machines is undecidable.",
          keyPoints: [
            "Applies only to semantic properties (about the language L(M), not the TM description)",
            "Property must be non-trivial (some TMs satisfy it, some don't)",
            "Trivial properties (satisfied by all TMs or no TMs) are decidable",
            "Syntactic properties (about TM structure) are typically decidable",
            "Provides a general method to prove undecidability without reduction"
          ],
          applications: [
            "Proving undecidability of compiler optimization problems",
            "Software verification limitations",
            "Program analysis tool limitations",
            "Theoretical foundations of computability"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["Rice's Theorem", "Undecidable Properties", "Semantic vs Syntactic Properties"],
          marks: "10-15 marks",
          commonQuestions: [
            "State and prove Rice's Theorem",
            "Determine if given property is decidable using Rice's Theorem",
            "Distinguish between semantic and syntactic properties",
            "Apply Rice's Theorem to prove undecidability"
          ],
          examTips: [
            "Remember: semantic = about language behavior, syntactic = about TM structure",
            "Check if property is trivial before applying Rice's theorem",
            "Practice identifying semantic vs syntactic properties",
            "Understand the proof technique using Halting Problem reduction"
          ]
        }}
        algorithm={{
          steps: [
            "To apply Rice's Theorem:",
            "1. Verify the property is semantic (about L(M), not TM structure)",
            "2. Check if property is non-trivial (some TMs satisfy, some don't)",
            "3. If both conditions met, property is undecidable by Rice's Theorem",
            "4. If property is syntactic or trivial, it may be decidable"
          ],
          complexity: {
            time: "Not applicable (proves undecidability)",
            space: "Not applicable (proves undecidability)"
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Analysis */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Property Analysis</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Select a Property to Analyze
            </label>
            <select 
              value={selectedProperty} 
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full p-2 border rounded-md bg-white text-black border-gray-300"
            >
              <option value="">Choose a property...</option>
              {propertyExamples.map((prop, index) => (
                <option key={index} value={prop.name}>
                  {prop.name}: {prop.description}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Or Describe Your Own Property
            </label>
            <Input
              value={customProperty}
              onChange={(e) => setCustomProperty(e.target.value)}
              placeholder="e.g., Does M accept at least 5 strings?"
              className="text-black bg-white"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={analyzeProperty} className="flex-1">
              Analyze Property
            </Button>
            <Button onClick={demonstrateRicesTheoremProof} variant="outline">
              Show Proof
            </Button>
          </div>

          {analysisResult && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2 text-black">Analysis Result:</h3>
              <p className="text-black">{analysisResult}</p>
            </div>
          )}
        </Card>

        {/* Analysis Steps */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Analysis Steps</h2>
          
          {proofSteps.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                {proofSteps.join('\n')}
              </pre>
            </div>
          ) : (
            <p className="text-black">Select a property and click &quot;Analyze Property&quot; to see the analysis.</p>
          )}
        </Card>
      </div>

      {/* Property Examples Table */}
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Property Classification Examples</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left text-black">Property</th>
                <th className="border border-gray-300 p-3 text-left text-black">Description</th>
                <th className="border border-gray-300 p-3 text-left text-black">Type</th>
                <th className="border border-gray-300 p-3 text-left text-black">Decidable?</th>
                <th className="border border-gray-300 p-3 text-left text-black">Reason</th>
              </tr>
            </thead>
            <tbody>
              {propertyExamples.map((prop, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-3 text-black font-medium">{prop.name}</td>
                  <td className="border border-gray-300 p-3 text-black">{prop.description}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      prop.isSemantic 
                        ? (prop.isTrivial ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800")
                        : "bg-green-100 text-green-800"
                    }`}>
                      {prop.isSemantic 
                        ? (prop.isTrivial ? "Trivial Semantic" : "Non-trivial Semantic")
                        : "Syntactic"
                      }
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      prop.isUndecidable ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {prop.isUndecidable ? "Undecidable" : "Decidable"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-sm text-black">
                    {prop.isSemantic 
                      ? (prop.isTrivial ? "Trivial property" : "Rice's Theorem")
                      : "Syntactic analysis"
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key Concepts */}
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Key Concepts and Distinctions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-black">Semantic vs Syntactic Properties</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded">
                <h4 className="font-medium text-red-800 mb-1">Semantic Properties</h4>
                <p className="text-sm text-black">
                  About the language L(M) or behavior of the TM. Examples: emptiness, 
                  regularity, finiteness, halting behavior.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium text-green-800 mb-1">Syntactic Properties</h4>
                <p className="text-sm text-black">
                  About the structure/description of the TM. Examples: number of states, 
                  alphabet size, transition count.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-black">Trivial vs Non-trivial Properties</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-medium text-yellow-800 mb-1">Trivial Properties</h4>
                <p className="text-sm text-black">
                  Satisfied by ALL TMs or NO TMs. Always decidable because 
                  answer is always the same.
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-800 mb-1">Non-trivial Properties</h4>
                <p className="text-sm text-black">
                  Satisfied by SOME TMs but not others. These are the properties 
                  Rice&apos;s theorem applies to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ExamResult
        title="Rice's Theorem Application"
        input={selectedProperty || "Property analysis"}
        result={proofSteps.length > 0}
        steps={proofSteps.map((step, index) => ({
          stepNumber: index + 1,
          description: step,
          explanation: step
        }))}
        finalAnswer={analysisResult || "Select a property and analyze it to see the result"}
        examFormat={{
          question: "Apply Rice's Theorem to determine if the given property is decidable.",
          solution: proofSteps,
          conclusion: "Rice's Theorem provides a systematic way to prove undecidability of semantic properties.",
          marks: 15
        }}
      />
    </div>
  );
}
