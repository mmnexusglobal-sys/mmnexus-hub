// lib/gemma.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const getGemmaModel = (modelName: string = 'gemini-2.5-flash') => {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_AI_API_KEY is not defined in the environment variables.");
    }
    genAI = new GoogleGenerativeAI(apiKey || '');
  }
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateResponse = async (prompt: string) => {
  const model = getGemmaModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};