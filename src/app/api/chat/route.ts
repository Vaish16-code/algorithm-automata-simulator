import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function POST(request: NextRequest) {
  if (!genAI) {
    return NextResponse.json(
      { error: 'Gemini AI service is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, algorithmContext } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const context = `You are an expert algorithm tutor helping computer science students understand algorithms. 
    Your role is to:
    - Explain algorithms in simple, easy-to-understand terms
    - Provide step-by-step breakdowns of algorithm processes
    - Help with time and space complexity analysis
    - Give practical examples and use cases
    - Answer questions about data structures and algorithms
    - Provide coding examples when helpful
    - Be encouraging and patient with students
    
    Always be educational, clear, and supportive in your responses.
    Keep responses concise but informative (maximum 300 words).`;

    const contextualMessage = algorithmContext 
      ? `${context}\n\nCurrent Algorithm Context: ${algorithmContext}\n\nStudent Question: ${message}`
      : `${context}\n\nStudent Question: ${message}`;

    const result = await model.generateContent(contextualMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
