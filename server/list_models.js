import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function test() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    console.log("Models:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();
