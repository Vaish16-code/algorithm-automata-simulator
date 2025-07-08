# 🤖 Algorithm Chatbot Setup Guide

## Overview
Your algorithm learning platform now includes an AI-powered chatbot using Google Gemini API that helps students understand algorithms, analyze complexity, and get step-by-step explanations.

## 🚀 Quick Setup

### 1. Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Open your `.env.local` file and replace `your_api_key_here` with your actual API key:

```env
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Your Development Server

```bash
npm run dev
```

## ✨ Features

### 🎯 Smart Algorithm Assistance
- **Step-by-step explanations** of merge sort and other algorithms
- **Complexity analysis** (time/space complexity)
- **Optimization suggestions**
- **Debugging help**

### 🎨 Interactive UI
- **Floating chatbot** button in bottom-right corner
- **Quick action buttons** for common questions
- **Context-aware responses** based on current algorithm step
- **Minimize/maximize** functionality
- **Real-time typing indicators**

### 🧠 Intelligent Context
- Knows which algorithm you're currently viewing
- Understands the current step in the visualization
- Can analyze the current array being sorted
- Provides relevant educational content

## 🔧 Usage Examples

### Quick Questions
- "Explain how merge sort works"
- "What's the time complexity?"
- "How can I optimize this?"
- "Explain this current step"

### Detailed Help
- "I don't understand why we divide the array in half"
- "How does the merge process work?"
- "When should I use merge sort vs quicksort?"
- "Can you show me the merge sort code?"

## 📁 File Structure

```
src/
├── lib/
│   └── gemini.ts              # AI service logic
├── components/
│   └── AlgorithmChatbot.tsx   # Chatbot UI component
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API endpoint for server-side calls
│   └── components/
│       └── MergeSortChart.tsx # Integration with merge sort
└── .env.local                 # API key configuration
```

## 🎓 Educational Benefits

- **Instant Help**: Students get immediate answers to algorithm questions
- **Step-by-step Learning**: Context-aware explanations based on current visualization step
- **Complexity Analysis**: Deep dive into time/space complexity concepts
- **Code Examples**: Practical implementation guidance
- **Debugging Support**: Help with common algorithm implementation issues

## 🔒 Security & Privacy

- API key stored securely in environment variables
- Server-side API calls protect your key from client exposure
- No personal data stored or transmitted
- Educational content only

## 🐛 Troubleshooting

### Chatbot Not Responding
1. Check if `.env.local` has the correct API key
2. Restart the development server
3. Check browser console for errors

### API Rate Limits
- Google Gemini free tier: 15 requests/minute, 1M tokens/month
- More than sufficient for educational use

### Error Messages
- Check network connection
- Verify API key is valid
- Ensure environment variables are loaded

## 🚀 Next Steps

The chatbot is now integrated with your merge sort visualization! Students can:

1. Click the purple chatbot button in the bottom-right corner
2. Ask questions about merge sort
3. Get explanations of current steps
4. Learn about complexity and optimizations

The AI tutor will provide educational, encouraging, and contextually relevant responses to help students master algorithms!
