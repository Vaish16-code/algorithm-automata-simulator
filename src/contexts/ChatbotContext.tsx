"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentAlgorithm: string;
  setCurrentAlgorithm: (algorithm: string) => void;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  currentData: any;
  setCurrentData: (data: any) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('algorithms');
  const [currentStep, setCurrentStep] = useState('');
  const [currentData, setCurrentData] = useState(null);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        currentAlgorithm,
        setCurrentAlgorithm,
        currentStep,
        setCurrentStep,
        currentData,
        setCurrentData,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
