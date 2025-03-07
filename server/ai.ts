import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface SymptomAnalysis {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  severity: "low" | "medium" | "high";
}

async function analyzeWithGemini(category: string, symptoms: string): Promise<SymptomAnalysis> {
  const model = genai.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze these medical symptoms and provide a diagnosis. Format the response as JSON with fields: diagnosis (string), confidence (number 0-1), recommendations (string array), and severity ("low", "medium", or "high").

  Category: ${category}
  Symptoms: ${symptoms}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return JSON.parse(response.text());
}

async function analyzeWithOpenAI(category: string, symptoms: string): Promise<SymptomAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a medical AI assistant. Analyze the symptoms and provide a preliminary diagnosis. Include confidence level, recommendations, and severity level. Output in JSON format.",
      },
      {
        role: "user",
        content: `Category: ${category}\nSymptoms: ${symptoms}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return content ? JSON.parse(content) : null;
}

export async function analyzeSymptoms(
  category: string,
  symptoms: string
): Promise<SymptomAnalysis> {
  try {
    // Try Gemini first (primary provider)
    try {
      return await analyzeWithGemini(category, symptoms);
    } catch (geminiError) {
      console.error("Gemini analysis failed:", geminiError);

      // Try OpenAI as fallback
      const openaiResult = await analyzeWithOpenAI(category, symptoms);
      if (!openaiResult) {
        throw new Error("OpenAI returned null response");
      }
      return openaiResult;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error("AI Analysis failed with unknown error");
  }
}