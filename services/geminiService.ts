import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile } from "../types";

/**
 * Gemini AI Service for AI Tutoring
 * 
 * ⚠️ SECURITY NOTE: This implementation exposes the API key to the client-side.
 * This is acceptable for development/demo but should be moved to a backend proxy
 * before production deployment. See SECURITY.md for recommendations.
 */

// Pedagogical System Instruction
const SYSTEM_INSTRUCTION = `
You are Sathi, a friendly, encouraging, and safe AI coding tutor for children (ages 8-14).
Your goal is to help them learn to code using the Socratic method.
Never give the direct answer immediately. Instead, guide them with hints and questions.
Use emojis to be engaging.
If the user is stuck, offer a "scaffolded" hint (a small piece of the puzzle).
Keep responses short (under 3 sentences) to reduce Cognitive Load.
Supports tracks: Scratch, Python, JavaScript.
Ensure all advice is child-safe and positive.
`;

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (aiClient) return aiClient;
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing");
    return null;
  }
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return aiClient;
};

export const initializeChat = (): void => {
  const ai = getClient();
  if (!ai) return;
  
  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini Chat", error);
  }
};

export const sendMessageToSathi = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) return "Oops! My brain isn't connected right now. Check the API Key.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm thinking...";
  } catch (error) {
    console.error("Sathi Error:", error);
    return "I had a little glitch! Can you ask that again?";
  }
};

export const generateLearningPlan = async (profile: UserProfile): Promise<string> => {
  const ai = getClient();
  if (!ai) return `Welcome ${profile.name}! Let's start coding!`;

  try {
    const prompt = `
      Create a very short, high-energy welcome message for a new coding student named ${profile.name}, who is in the age group ${profile.ageGroup}.
      Their interests are: ${profile.goals.join(', ')}.
      Their experience level is: ${profile.experience}.
      
      Recommend one of these tracks: Scratch (Visual), Python (Logic/Data), or JavaScript (Web) based on their age and interests.
      Format: "Welcome [Name]! 🚀 Since you like [Interest], I think you'll love [Track]..."
      Keep it under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || `Welcome ${profile.name}! Let's start your coding adventure!`;
  } catch (error) {
    console.error("Plan Gen Error:", error);
    return `Welcome ${profile.name}! Ready to become a coding wizard?`;
  }
};