// lib/gemma.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const getGemmaModel = (modelName: string = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateResponse = async (prompt: string) => {
  const model = getGemmaModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};