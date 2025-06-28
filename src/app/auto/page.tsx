"use client";

import Link from "next/link";

export default function AutomataTheoryPage() {
  const topics = [
    {
      title: "Finite Automata",
      description: "Simulate Deterministic and Non-deterministic Finite Automata",
      categories: [
        {
          name: "DFA Simulator",
          href: "/auto/finite-automata/dfa",
          description: "Deterministic Finite Automaton simulation"
        },
        {
          name: "NFA Simulator", 
          href: "/auto/finite-automata/nfa",
          description: "Non-deterministic Finite Automaton simulation"
        },
        {
          name: "NFA to DFA Conversion",
          href: "/auto/finite-automata/nfa-to-dfa",
          description: "Convert NFA to equivalent DFA"
        }
      ]
    },
    {
      title: "Regular Expressions",
      description: "Work with Regular Expressions and their properties",
      categories: [
        {
          name: "Regex Matcher",
          href: "/auto/regular-expressions/matcher",
          description: "Test strings against regular expressions"
        },
        {
          name: "Regex to FA",
          href: "/auto/regular-expressions/regex-to-fa",
          description: "Convert regular expressions to finite automata"
        }
      ]
    },
    {
      title: "Context-Free Grammars",
      description: "Parse and generate strings using Context-Free Grammars",
      categories: [
        {
          name: "CFG Parser",
          href: "/auto/context-free-grammar/parser",
          description: "Parse strings using context-free grammars"
        },
        {
          name: "Derivation Trees",
          href: "/auto/context-free-grammar/derivation",
          description: "Generate derivation trees for CFG"
        }
      ]
    },
    {
      title: "Pushdown Automata",
      description: "Simulate Pushdown Automata for context-free languages",
      categories: [
        {
          name: "PDA Simulator",
          href: "/auto/pushdown-automata/simulator",
          description: "Simulate pushdown automaton execution"
        }
      ]
    },
    {
      title: "Turing Machines",
      description: "Simulate Turing Machines and understand computability",
      categories: [
        {
          name: "TM Simulator",
          href: "/auto/turing-machines/simulator",
          description: "Simulate Turing machine execution"
        },
        {
          name: "Multi-tape TM",
          href: "/auto/turing-machines/multi-tape",
          description: "Multi-tape Turing machine simulation"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Automata Theory Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive simulators for Finite Automata, Regular Expressions, Context-Free Grammars, 
            Pushdown Automata, and Turing Machines. Learn through step-by-step execution and visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
                <p className="text-purple-100 text-sm mt-1">{topic.description}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {topic.categories.map((category, catIndex) => (
                    <Link
                      key={catIndex}
                      href={category.href}
                      className="block p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-purple-700">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                        <div className="text-purple-400 group-hover:text-purple-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Automata Theory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Key Concepts:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Formal Languages and Grammars</li>
                <li>• Regular Languages and Finite Automata</li>
                <li>• Context-Free Languages and Pushdown Automata</li>
                <li>• Recursively Enumerable Languages and Turing Machines</li>
                <li>• Computability and Decidability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Applications:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Compiler Design and Lexical Analysis</li>
                <li>• Text Processing and Pattern Matching</li>
                <li>• Network Protocol Verification</li>
                <li>• Model Checking and Formal Verification</li>
                <li>• Database Query Optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
