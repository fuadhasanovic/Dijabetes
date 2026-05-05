import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text || !targetLanguage || targetLanguage === 'en') return text;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLanguage}. Provide only the translated text, no explanation: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function getDiabetesAdvice(status: string, values: any): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `System: You are GlucoGuard AI medical assistant. A user with Type 2 Diabetes is asking for advice.
      Status: ${status}
      Context: ${JSON.stringify(values)}
      Task: Provide short, actionable, medical-style advice (max 3 sentences). Include a disclaimer that you are an AI and not a doctor.
      Language: Please respond in the language requested by the user context or default to English.`,
    });
    return response.text.trim();
  } catch (error) {
    return "Please consult your doctor immediately.";
  }
}
