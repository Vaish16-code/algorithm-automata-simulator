"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2, HelpCircle, Lightbulb, Code, Zap, BookOpen, Calculator, Database, Layers, GitBranch, Network, Cpu, BarChart3 } from 'lucide-react';
import { algorithmChatbot, ChatMessage } from '../lib/gemini';
import { useChatbot } from '../contexts/ChatbotContext';
import { usePathname } from 'next/navigation';

export default function GlobalAlgorithmChatbot() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, currentAlgorithm, currentStep, currentData } = useChatbot();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect current page and set appropriate algorithm context
  const getPageContext = () => {
    if (pathname.includes('/auto/')) {
      if (pathname.includes('dfa') || pathname.includes('finite-automata')) return 'DFA (Deterministic Finite Automata)';
      if (pathname.includes('nfa')) return 'NFA (Non-deterministic Finite Automata)';
      if (pathname.includes('pushdown')) return 'Pushdown Automata';
      if (pathname.includes('turing')) return 'Turing Machine';
      if (pathname.includes('regular')) return 'Regular Languages & Expressions';
      if (pathname.includes('context-free')) return 'Context-Free Languages';
      return 'Automata Theory';
    }
    
    if (pathname.includes('/daa/')) {
      if (pathname.includes('merge-sort')) return 'Merge Sort';
      if (pathname.includes('quick-sort')) return 'Quick Sort';
      if (pathname.includes('divide-conquer')) return 'Divide and Conquer';
      if (pathname.includes('dynamic')) return 'Dynamic Programming';
      if (pathname.includes('greedy')) return 'Greedy Algorithms';
      if (pathname.includes('backtracking')) return 'Backtracking';
      if (pathname.includes('branch-bound')) return 'Branch and Bound';
      return 'Design and Analysis of Algorithms';
    }
    
    if (pathname.includes('/os/')) {
      if (pathname.includes('cpu-scheduling')) return 'CPU Scheduling';
      if (pathname.includes('deadlock')) return 'Deadlock Management';
      if (pathname.includes('memory')) return 'Memory Management';
      if (pathname.includes('page-replacement')) return 'Page Replacement';
      if (pathname.includes('disk-scheduling')) return 'Disk Scheduling';
      return 'Operating Systems';
    }
    
    if (pathname.includes('/cn/')) {
      if (pathname.includes('routing')) return 'Network Routing';
      if (pathname.includes('tcp')) return 'TCP/IP Protocol';
      if (pathname.includes('osi')) return 'OSI Model';
      if (pathname.includes('network-layer')) return 'Network Layer';
      return 'Computer Networks';
    }
    
    return 'Computer Science Algorithms';
  };

  const pageContext = getPageContext();

  // Initialize welcome message based on current page
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hi! I'm your AI tutor 🤖 I'm here to help you understand ${pageContext}. I can explain concepts, analyze complexity, debug problems, and answer any questions you have. What would you like to learn today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [pageContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const algorithmContext = `Current page: ${pageContext}, Current algorithm: ${currentAlgorithm || pageContext}, Current step: ${currentStep || 'N/A'}, Additional context: Learning about ${pageContext}`;
      
      const response = await algorithmChatbot.sendMessage(inputMessage, algorithmContext);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or check your internet connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickActions = () => {
    const baseActions = [
      { icon: HelpCircle, label: 'Explain', question: `Explain ${pageContext} in simple terms` },
      { icon: Zap, label: 'Complexity', question: `What's the time and space complexity of ${pageContext}?` },
    ];

    // Add context-specific actions
    if (pathname.includes('/daa/')) {
      return [
        ...baseActions,
        { icon: Code, label: 'Code', question: `Show me pseudocode for ${pageContext}` },
        { icon: Lightbulb, label: 'Examples', question: `Give me practical examples of ${pageContext}` },
      ];
    } else if (pathname.includes('/auto/')) {
      return [
        ...baseActions,
        { icon: Network, label: 'Diagram', question: `How do I draw a ${pageContext} diagram?` },
        { icon: GitBranch, label: 'States', question: `Explain states and transitions in ${pageContext}` },
      ];
    } else if (pathname.includes('/os/')) {
      return [
        ...baseActions,
        { icon: Cpu, label: 'Process', question: `How does ${pageContext} work in operating systems?` },
        { icon: BarChart3, label: 'Performance', question: `What are the performance implications of ${pageContext}?` },
      ];
    } else if (pathname.includes('/cn/')) {
      return [
        ...baseActions,
        { icon: Layers, label: 'Layers', question: `Which network layers are involved in ${pageContext}?` },
        { icon: Database, label: 'Protocols', question: `What protocols are used in ${pageContext}?` },
      ];
    }

    return baseActions;
  };

  const handleQuickQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const algorithmContext = `Current page: ${pageContext}, Current algorithm: ${currentAlgorithm || pageContext}, Learning context: ${pageContext}`;
      const response = await algorithmChatbot.sendMessage(question, algorithmContext);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with quick question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        <div className="absolute bottom-full right-0 mb-2 px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
          AI Tutor - Ask me anything!
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized 
        ? 'w-64 sm:w-72 lg:w-80 h-12 sm:h-14 lg:h-16' 
        : 'w-[calc(100vw-16px)] max-w-xs sm:max-w-sm lg:max-w-md xl:w-96 h-[calc(100vh-80px)] max-h-[500px] sm:max-h-[550px] lg:max-h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          <div>
            <span className="font-semibold text-sm sm:text-base">AI Tutor</span>
            <div className="text-xs opacity-80 hidden sm:block">{pageContext}</div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            title="Close"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions */}
          <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 mb-2">Quick Help:</div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {getQuickActions().map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(action.question)}
                  className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  disabled={isLoading}
                  title={action.question}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.label.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 h-64 sm:h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`flex items-start space-x-2 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</div>
                      {message.timestamp && (
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-2 sm:p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${pageContext.length > 20 ? pageContext.split(' ')[0] + '...' : pageContext}`}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 text-white p-1 sm:p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
