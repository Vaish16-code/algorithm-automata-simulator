'use client';

import { CheckCircle2, XCircle, ArrowRight, Copy, BookOpen, Award } from 'lucide-react';
import { useState } from 'react';

interface SimulationStep {
  stepNumber: number;
  description: string;
  currentState?: string;
  input?: string;
  transition?: string;
  explanation: string;
}

interface ExamResultProps {
  title: string;
  input: string;
  result: boolean;
  steps: SimulationStep[];
  finalAnswer: string;
  examFormat: {
    question: string;
    solution: string[];
    conclusion: string;
    marks: number;
  };
}

export default function ExamResult({ title, input, result, steps, finalAnswer, examFormat }: ExamResultProps) {
  const [showExamFormat, setShowExamFormat] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const examText = formatForExam();
    navigator.clipboard.writeText(examText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatForExam = () => {
    let examText = `Question: ${examFormat.question}\n\n`;
    examText += `Solution:\n`;
    examFormat.solution.forEach((line, index) => {
      examText += `${index + 1}. ${line}\n`;
    });
    examText += `\nStep-by-step execution:\n`;
    steps.forEach((step) => {
      examText += `Step ${step.stepNumber}: ${step.description}\n`;
      if (step.explanation) {
        examText += `   Explanation: ${step.explanation}\n`;
      }
    });
    examText += `\nConclusion: ${examFormat.conclusion}\n`;
    examText += `Final Answer: ${finalAnswer}\n`;
    return examText;
  };

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className={`rounded-2xl p-6 text-white ${result ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {result ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
            <div>
              <h3 className="text-2xl font-bold">{title} Result</h3>
              <p className="text-white/90">Input: &quot;{input}&quot;</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{result ? 'ACCEPTED' : 'REJECTED'}</div>
            <div className="text-sm opacity-90">{finalAnswer}</div>
          </div>
        </div>
      </div>

      {/* Simulation Steps */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <h4 className="text-xl font-bold">Simulation Steps</h4>
          <p className="text-blue-100">Step-by-step execution trace</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 mb-1">{step.description}</div>
                  {step.currentState && (
                    <div className="text-sm text-gray-900 mb-1">
                      <span className="font-medium">Current State:</span> {step.currentState}
                    </div>
                  )}
                  {step.input && (
                    <div className="text-sm text-gray-900 mb-1">
                      <span className="font-medium">Processing:</span> {step.input}
                    </div>
                  )}
                  {step.transition && (
                    <div className="text-sm text-gray-900 mb-1">
                      <span className="font-medium">Transition:</span> {step.transition}
                    </div>
                  )}
                  <div className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded mt-2">
                    💡 {step.explanation}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Format Toggle */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowExamFormat(!showExamFormat)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {showExamFormat ? 'Hide' : 'Show'} Exam Format
        </button>
        
        {showExamFormat && (
          <button
            onClick={copyToClipboard}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors duration-200"
          >
            <Copy className="h-5 w-5 mr-2" />
            {copied ? 'Copied!' : 'Copy Answer'}
          </button>
        )}
      </div>

      {/* Mumbai University Exam Format */}
      {showExamFormat && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6" />
                <div>
                  <h4 className="text-xl font-bold">Mumbai University Answer Format</h4>
                  <p className="text-purple-100">Ready-to-write exam answer</p>
                </div>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {examFormat.marks} Marks
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Question */}
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Question:</h5>
              <div className="bg-white border-l-4 border-purple-500 p-4 rounded">
                <p className="text-gray-900 font-medium">{examFormat.question}</p>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Solution:</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <ol className="space-y-2">
                  {examFormat.solution.map((line, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-900">{line}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Execution Steps */}
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Step-by-step Execution:</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900">Step</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900">Description</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900">State</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {steps.map((step, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 font-medium text-purple-700">{step.stepNumber}</td>
                          <td className="px-3 py-2 text-black">{step.description}</td>
                          <td className="px-3 py-2 text-black">{step.currentState || '-'}</td>
                          <td className="px-3 py-2 text-gray-900 text-sm">{step.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Conclusion:</h5>
              <div className={`border-l-4 p-4 rounded ${result ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <p className={`font-semibold ${result ? 'text-green-800' : 'text-red-800'}`}>
                  {examFormat.conclusion}
                </p>
                <p className="text-gray-900 mt-1 font-medium">
                  <strong>Final Answer:</strong> {finalAnswer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
