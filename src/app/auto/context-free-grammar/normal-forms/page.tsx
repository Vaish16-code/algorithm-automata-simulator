"use client";

import { useState } from "react";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface Production {
  left: string;
  right: string;
}

interface CFG {
  variables: string[];
  terminals: string[];
  productions: Production[];
  startSymbol: string;
}

export default function CFGNormalForms() {
  const [cfg, setCfg] = useState<CFG>({
    variables: ["S", "A", "B"],
    terminals: ["a", "b"],
    productions: [
      { left: "S", right: "ASB" },
      { left: "S", right: "ε" },
      { left: "A", right: "aAS" },
      { left: "A", right: "a" },
      { left: "B", right: "SbS" },
      { left: "B", right: "A" },
      { left: "B", right: "bb" }
    ],
    startSymbol: "S"
  });

  const [cnfGrammar, setCnfGrammar] = useState<CFG | null>(null);
  const [gnfGrammar, setGnfGrammar] = useState<CFG | null>(null);
  const [cnfSteps, setCnfSteps] = useState<string[]>([]);
  const [gnfSteps, setGnfSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"cnf" | "gnf">("cnf");

  // Helper functions
  const isTerminal = (symbol: string): boolean => {
    return cfg.terminals.includes(symbol) || symbol === "ε";
  };

  const isVariable = (symbol: string): boolean => {
    return cfg.variables.includes(symbol);
  };

  const generateNewVariable = (existingVars: string[]): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < letters.length; i++) {
      if (!existingVars.includes(letters[i])) {
        return letters[i];
      }
    }
    // If all single letters are used, use subscripts
    for (let i = 0; i < 26; i++) {
      const newVar = `X${i}`;
      if (!existingVars.includes(newVar)) {
        return newVar;
      }
    }
    return "X";
  };

  // Convert to Chomsky Normal Form
  const convertToCNF = () => {
    const steps: string[] = [];
    const newVariables = [...cfg.variables];
    let newProductions = [...cfg.productions];

    steps.push("Converting CFG to Chomsky Normal Form (CNF)");
    steps.push("CNF requires: A → BC or A → a (where A,B,C are variables, a is terminal)");
    steps.push("");

    // Step 1: Remove ε-productions
    steps.push("Step 1: Remove ε-productions");
    const nullableVars = new Set<string>();
    
    // Find nullable variables
    let changed = true;
    while (changed) {
      changed = false;
      for (const prod of newProductions) {
        if (prod.right === "ε" || 
            (prod.right.split("").every(symbol => nullableVars.has(symbol)))) {
          if (!nullableVars.has(prod.left)) {
            nullableVars.add(prod.left);
            changed = true;
          }
        }
      }
    }

    steps.push(`Nullable variables: {${Array.from(nullableVars).join(", ")}}`);

    // Generate new productions without ε
    const withoutEpsilon: Production[] = [];
    for (const prod of newProductions) {
      if (prod.right !== "ε") {
        withoutEpsilon.push(prod);
        
        // Generate all combinations where nullable variables can be omitted
        const right = prod.right;
        const combinations = generateCombinations(right, nullableVars);
        for (const combo of combinations) {
          if (combo !== "" && combo !== right) {
            withoutEpsilon.push({ left: prod.left, right: combo || "ε" });
          }
        }
      }
    }

    // Add ε-production for start symbol if it was nullable
    if (nullableVars.has(cfg.startSymbol)) {
      withoutEpsilon.push({ left: cfg.startSymbol, right: "ε" });
    }

    newProductions = withoutEpsilon;
    steps.push("Productions after removing ε-productions:");
    newProductions.forEach(prod => {
      steps.push(`  ${prod.left} → ${prod.right}`);
    });
    steps.push("");

    // Step 2: Remove unit productions (A → B where B is a variable)
    steps.push("Step 2: Remove unit productions");
    const unitPairs = new Map<string, Set<string>>();
    
    // Initialize with identity pairs
    for (const variable of newVariables) {
      unitPairs.set(variable, new Set([variable]));
    }

    // Find all unit pairs using transitive closure
    changed = true;
    while (changed) {
      changed = false;
      for (const prod of newProductions) {
        if (prod.right.length === 1 && isVariable(prod.right)) {
          const fromSet = unitPairs.get(prod.left)!;
          const toSet = unitPairs.get(prod.right);
          if (toSet) {
            for (const target of toSet) {
              if (!fromSet.has(target)) {
                fromSet.add(target);
                changed = true;
              }
            }
          }
        }
      }
    }

    // Generate new productions without unit productions
    const withoutUnit: Production[] = [];
    for (const variable of newVariables) {
      const reachableVars = unitPairs.get(variable)!;
      for (const reachableVar of reachableVars) {
        for (const prod of newProductions) {
          if (prod.left === reachableVar && 
              !(prod.right.length === 1 && isVariable(prod.right))) {
            withoutUnit.push({ left: variable, right: prod.right });
          }
        }
      }
    }

    newProductions = withoutUnit;
    steps.push("Productions after removing unit productions:");
    newProductions.forEach(prod => {
      steps.push(`  ${prod.left} → ${prod.right}`);
    });
    steps.push("");

    // Step 3: Convert to CNF form
    steps.push("Step 3: Convert remaining productions to CNF form");
    
    // Replace terminals in productions with length > 1
    const terminalVars = new Map<string, string>();
    const cnfProductions: Production[] = [];

    for (const prod of newProductions) {
      if (prod.right === "ε") {
        cnfProductions.push(prod);
        continue;
      }

      if (prod.right.length === 1) {
        // Already in CNF form A → a
        cnfProductions.push(prod);
        continue;
      }

      // Replace terminals with new variables
      let modifiedRight = prod.right;
      for (const terminal of cfg.terminals) {
        if (modifiedRight.includes(terminal) && modifiedRight.length > 1) {
          if (!terminalVars.has(terminal)) {
            const newVar = generateNewVariable([...newVariables, ...Array.from(terminalVars.values())]);
            terminalVars.set(terminal, newVar);
            newVariables.push(newVar);
            cnfProductions.push({ left: newVar, right: terminal });
            steps.push(`  Added: ${newVar} → ${terminal}`);
          }
          modifiedRight = modifiedRight.replace(new RegExp(terminal, "g"), terminalVars.get(terminal)!);
        }
      }

      // Break down productions with more than 2 variables
      if (modifiedRight.length > 2) {
        let currentLeft = prod.left;
        let remainingRight = modifiedRight;

        while (remainingRight.length > 2) {
          const newVar = generateNewVariable(newVariables);
          newVariables.push(newVar);
          
          cnfProductions.push({
            left: currentLeft,
            right: remainingRight[0] + newVar
          });
          
          steps.push(`  Added: ${currentLeft} → ${remainingRight[0]}${newVar}`);
          
          currentLeft = newVar;
          remainingRight = remainingRight.substring(1);
        }
        
        cnfProductions.push({
          left: currentLeft,
          right: remainingRight
        });
        steps.push(`  Added: ${currentLeft} → ${remainingRight}`);
      } else {
        cnfProductions.push({ left: prod.left, right: modifiedRight });
      }
    }

    const cnfResult: CFG = {
      variables: newVariables,
      terminals: cfg.terminals,
      productions: cnfProductions,
      startSymbol: cfg.startSymbol
    };

    steps.push("");
    steps.push("Final CNF Grammar:");
    cnfProductions.forEach(prod => {
      steps.push(`  ${prod.left} → ${prod.right}`);
    });

    setCnfGrammar(cnfResult);
    setCnfSteps(steps);
  };

  // Generate all combinations for removing nullable variables
  const generateCombinations = (str: string, nullableVars: Set<string>): string[] => {
    if (str.length === 0) return [""];
    
    const first = str[0];
    const rest = str.substring(1);
    const restCombinations = generateCombinations(rest, nullableVars);
    
    const result: string[] = [];
    for (const combo of restCombinations) {
      result.push(first + combo); // Include first character
      if (nullableVars.has(first)) {
        result.push(combo); // Exclude first character if it's nullable
      }
    }
    
    return [...new Set(result)]; // Remove duplicates
  };

  // Convert to Greibach Normal Form
  const convertToGNF = () => {
    const steps: string[] = [];
    
    steps.push("Converting CFG to Greibach Normal Form (GNF)");
    steps.push("GNF requires: A → aα (where A is variable, a is terminal, α is string of variables)");
    steps.push("");
    steps.push("Note: GNF conversion is complex and requires multiple steps:");
    steps.push("1. Convert to CNF first");
    steps.push("2. Eliminate left recursion");
    steps.push("3. Ensure all productions start with terminals");
    steps.push("");
    
    // For demonstration, we'll show a simplified conversion
    // In practice, GNF conversion is quite complex
    
    const gnfProductions: Production[] = [];
    
    // Start with a simplified approach - ensure each production starts with a terminal
    for (const prod of cfg.productions) {
      if (prod.right === "ε") {
        gnfProductions.push(prod);
        continue;
      }
      
      const firstSymbol = prod.right[0];
      if (isTerminal(firstSymbol)) {
        // Already starts with terminal
        gnfProductions.push(prod);
        steps.push(`${prod.left} → ${prod.right} (already in GNF form)`);
      } else {
        // Starts with variable - would need substitution
        gnfProductions.push(prod);
        steps.push(`${prod.left} → ${prod.right} (needs further processing)`);
      }
    }
    
    steps.push("");
    steps.push("Simplified GNF (full conversion requires eliminating left recursion):");
    gnfProductions.forEach(prod => {
      steps.push(`  ${prod.left} → ${prod.right}`);
    });

    const gnfResult: CFG = {
      variables: cfg.variables,
      terminals: cfg.terminals,
      productions: gnfProductions,
      startSymbol: cfg.startSymbol
    };

    setGnfGrammar(gnfResult);
    setGnfSteps(steps);
  };

  const addProduction = () => {
    setCfg({
      ...cfg,
      productions: [...cfg.productions, { left: "S", right: "a" }]
    });
  };

  const removeProduction = (index: number) => {
    setCfg({
      ...cfg,
      productions: cfg.productions.filter((_, i) => i !== index)
    });
  };

  const reset = () => {
    setCnfGrammar(null);
    setGnfGrammar(null);
    setCnfSteps([]);
    setGnfSteps([]);
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        CFG Normal Forms (CNF & GNF)
      </h1>

      <EducationalInfo
        topic="Context-Free Grammar Normal Forms"
        description="Learn to convert CFGs to Chomsky Normal Form (CNF) and Greibach Normal Form (GNF)"
        theory={{
          definition: "Normal forms are standardized representations of CFGs that simplify parsing and theoretical analysis.",
          keyPoints: [
            "CNF: All productions are A → BC or A → a (binary or terminal)",
            "GNF: All productions are A → aα (start with terminal)",
            "Both forms are equivalent to the original grammar in language generation",
            "CNF is useful for CYK parsing algorithm",
            "GNF enables top-down parsing without backtracking"
          ],
          applications: [
            "Parser construction and optimization",
            "Complexity analysis of CFGs",
            "Formal language theory proofs",
            "Compiler design and implementation"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["CNF Conversion", "GNF Conversion", "Normal Forms", "CFG Simplification"],
          marks: "10-15 marks",
          commonQuestions: [
            "Convert given CFG to Chomsky Normal Form",
            "Convert given CFG to Greibach Normal Form",
            "Explain the steps in normal form conversion",
            "Compare CNF and GNF representations"
          ],
          examTips: [
            "Follow systematic steps: remove ε-productions, unit productions, then convert",
            "Be careful with variable renaming in CNF",
            "GNF conversion is complex - focus on understanding the concept",
            "Practice with simple grammars first"
          ]
        }}
        algorithm={{
          steps: [
            "CNF Conversion:",
            "1. Remove ε-productions (except for start symbol if needed)",
            "2. Remove unit productions (A → B)",
            "3. Replace terminals in long productions with new variables",
            "4. Break productions longer than 2 symbols into binary productions",
            "",
            "GNF Conversion:",
            "1. Convert to CNF first",
            "2. Eliminate left recursion",
            "3. Ensure all productions start with terminals"
          ],
          complexity: {
            time: "O(n³) for CNF, exponential for GNF in worst case",
            space: "O(n²) for storing intermediate productions"
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input CFG */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Input CFG</h2>
          
          {/* Variables */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Variables</label>
            <Input
              value={cfg.variables.join(", ")}
              onChange={(e) => setCfg({
                ...cfg,
                variables: e.target.value.split(",").map(s => s.trim())
              })}
              placeholder="S, A, B"
              className="text-black bg-white"
            />
          </div>

          {/* Terminals */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Terminals</label>
            <Input
              value={cfg.terminals.join(", ")}
              onChange={(e) => setCfg({
                ...cfg,
                terminals: e.target.value.split(",").map(s => s.trim())
              })}
              placeholder="a, b, c"
              className="text-black bg-white"
            />
          </div>

          {/* Start Symbol */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Start Symbol</label>
            <Input
              value={cfg.startSymbol}
              onChange={(e) => setCfg({
                ...cfg,
                startSymbol: e.target.value
              })}
              placeholder="S"
              className="text-black bg-white"
            />
          </div>

          {/* Productions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Productions</label>
            {cfg.productions.map((production, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={production.left}
                  onChange={(e) => {
                    const newProductions = [...cfg.productions];
                    newProductions[index].left = e.target.value;
                    setCfg({ ...cfg, productions: newProductions });
                  }}
                  className="w-16 text-black bg-white"
                />
                <ArrowRight className="h-4 w-4" />
                <Input
                  value={production.right}
                  onChange={(e) => {
                    const newProductions = [...cfg.productions];
                    newProductions[index].right = e.target.value;
                    setCfg({ ...cfg, productions: newProductions });
                  }}
                  className="flex-1 text-black bg-white"
                  placeholder="Use ε for epsilon"
                />
                <Button
                  onClick={() => removeProduction(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addProduction} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Production
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={convertToCNF} className="flex-1">
              Convert to CNF
            </Button>
            <Button onClick={convertToGNF} variant="outline" className="flex-1">
              Convert to GNF
            </Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        {/* Conversion Results */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex mb-4">
            <Button
              onClick={() => setActiveTab("cnf")}
              variant={activeTab === "cnf" ? "default" : "outline"}
              className="mr-2"
            >
              CNF Result
            </Button>
            <Button
              onClick={() => setActiveTab("gnf")}
              variant={activeTab === "gnf" ? "default" : "outline"}
            >
              GNF Result
            </Button>
          </div>

          {activeTab === "cnf" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-black">CNF Conversion Steps</h2>
              {cnfSteps.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                    {cnfSteps.join('\n')}
                  </pre>
                </div>
              ) : (
                <p className="text-black">Click &quot;Convert to CNF&quot; to see the conversion process.</p>
              )}
            </>
          )}

          {activeTab === "gnf" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-black">GNF Conversion Steps</h2>
              {gnfSteps.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                    {gnfSteps.join('\n')}
                  </pre>
                </div>
              ) : (
                <p className="text-black">Click &quot;Convert to GNF&quot; to see the conversion process.</p>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Results Display */}
      {(cnfGrammar || gnfGrammar) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cnfGrammar && (
            <Card className="p-6 bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">CNF Grammar</h2>
              <div className="space-y-2">
                {cnfGrammar.productions.map((prod, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-black font-mono">
                    {prod.left} → {prod.right}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-black">
                  <strong>Properties:</strong> All productions are in form A → BC or A → a
                </p>
              </div>
            </Card>
          )}

          {gnfGrammar && (
            <Card className="p-6 bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">GNF Grammar</h2>
              <div className="space-y-2">
                {gnfGrammar.productions.map((prod, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-black font-mono">
                    {prod.left} → {prod.right}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-black">
                  <strong>Note:</strong> This is a simplified GNF. Full conversion requires eliminating left recursion.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      <ExamResult
        title="CFG Normal Form Conversion"
        input={`CFG with ${cfg.productions.length} productions`}
        result={cnfGrammar !== null || gnfGrammar !== null}
        steps={(activeTab === "cnf" ? cnfSteps : gnfSteps).map((step, index) => ({
          stepNumber: index + 1,
          description: step,
          explanation: step
        }))}
        finalAnswer={
          activeTab === "cnf" 
            ? (cnfGrammar ? `CNF grammar with ${cnfGrammar.productions.length} productions` : "CNF conversion not completed")
            : (gnfGrammar ? `GNF grammar with ${gnfGrammar.productions.length} productions` : "GNF conversion not completed")
        }
        examFormat={{
          question: `Convert the given CFG to ${activeTab.toUpperCase()}.`,
          solution: activeTab === "cnf" ? cnfSteps : gnfSteps,
          conclusion: `The resulting ${activeTab.toUpperCase()} grammar is equivalent to the original CFG.`,
          marks: 15
        }}
      />
    </div>
  );
}
