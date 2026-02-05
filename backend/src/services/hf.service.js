import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.warn("Warning: GOOGLE_GEMINI_API_KEY is missing via process.env");
}

export async function generateCaption(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await model.generateContent(prompt);

    clearTimeout(timeoutId);

    if (response && response.response && response.response.text) {
      return response.response.text().trim();
    }

    throw new Error("Invalid response format from Gemini API");
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Gemini Service Error:", err);
    throw err;
  }
}
