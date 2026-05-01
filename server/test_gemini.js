import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.models.forEach(m => console.log(m.name));
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();
