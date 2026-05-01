import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiResponse(userMessage, language = 'English') {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
You are Votesaathi, a helpful Election Process Assistant for Indian users.
Your goal is to educate users about the election process in India.

Rules:
- RESPOND ONLY IN ${language}.
- If the language is Hindi or Telugu, use the respective native script.
- Explain in simple, beginner-friendly language.
- Explain step-by-step.
- Avoid difficult legal or technical jargon.
- Give real-life examples.

If user asks about voting:
Explain like guiding a first-time voter.

User question: ${userMessage}

Give:
- Step-by-step answer
- Short explanation
- Beginner-friendly content
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
}
