import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Google Gemini API key not found. Please add GOOGLE_GEMINI_API_KEY to your environment variables.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export class AlgorithmChatbot {
  private model: any;
  private context: string;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    
    this.context = `You are an expert algorithm tutor helping computer science students understand algorithms. 
    Your role is to:
    - Explain algorithms in simple, easy-to-understand terms
    - Provide step-by-step breakdowns of algorithm processes
    - Help with time and space complexity analysis
    - Give practical examples and use cases
    - Answer questions about data structures and algorithms
    - Provide coding examples when helpful
    - Be encouraging and patient with students
    
    Current context: The student is learning about sorting algorithms, specifically merge sort.
    Always be educational, clear, and supportive in your responses.`;
  }

  async sendMessage(message: string, algorithmContext?: string): Promise<string> {
    // Use API route for server-side processing
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          algorithmContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Fallback to direct API call if server route fails
      if (!this.model) {
        return "I'm sorry, but the AI service is not available right now. Please check if the API key is configured correctly.";
      }

      try {
        const contextualMessage = algorithmContext 
          ? `${this.context}\n\nCurrent Algorithm Context: ${algorithmContext}\n\nStudent Question: ${message}`
          : `${this.context}\n\nStudent Question: ${message}`;

        const result = await this.model.generateContent(contextualMessage);
        const response = await result.response;
        return response.text();
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return "I'm sorry, I encountered an error while processing your question. Please try again or check your internet connection.";
      }
    }
  }

  async explainAlgorithm(algorithmName: string, currentStep?: string): Promise<string> {
    const prompt = currentStep 
      ? `Explain the ${algorithmName} algorithm, with special focus on this step: "${currentStep}". Provide a clear, educational explanation suitable for students.`
      : `Explain the ${algorithmName} algorithm in detail. Include how it works, its time complexity, space complexity, and when to use it. Make it educational and easy to understand.`;
    
    return this.sendMessage(prompt);
  }

  async analyzeComplexity(algorithmName: string): Promise<string> {
    const prompt = `Analyze the time and space complexity of ${algorithmName}. Explain why it has this complexity and compare it with other similar algorithms. Use simple terms that students can understand.`;
    return this.sendMessage(prompt);
  }

  async suggestOptimizations(algorithmName: string, currentArray?: number[]): Promise<string> {
    const arrayInfo = currentArray ? ` The current array being sorted is: [${currentArray.join(', ')}]` : '';
    const prompt = `Suggest optimizations or variations of the ${algorithmName} algorithm.${arrayInfo} Explain when these optimizations would be beneficial and provide practical examples.`;
    return this.sendMessage(prompt);
  }

  async helpWithDebugging(algorithmName: string, issue: string): Promise<string> {
    const prompt = `A student is having trouble with ${algorithmName}: "${issue}". Provide helpful guidance to debug and understand the problem. Be encouraging and provide step-by-step help.`;
    return this.sendMessage(prompt);
  }
}

export const algorithmChatbot = new AlgorithmChatbot();
