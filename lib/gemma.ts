// lib/gemma.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.warn("GOOGLE_AI_API_KEY is not defined in the environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey || '');
export const getGemmaModel = (modelName: string = 'gemma4') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateResponse = async (prompt: string) => {
  const model = getGemmaModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};