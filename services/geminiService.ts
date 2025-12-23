
import { GoogleGenAI, Type } from "@google/genai";
import { SmartTriageResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartTriage = async (
  description: string, 
  image?: { data: string; mimeType: string }
): Promise<SmartTriageResult> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `Act as an emergency medical dispatcher. Analyze the following accident report and provide a triage summary.
  Report Description: "${description}"
  Determine severity (Critical, High, Medium, Low), suggest 3 immediate recommended actions for first responders, and a concise 1-sentence summary.`;

  const parts: any[] = [{ text: prompt }];
  if (image) {
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING },
            recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["severity", "recommendedActions", "summary"]
        },
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return {
      severity: "Unknown",
      recommendedActions: ["Wait for professional help", "Secure the scene", "Keep patient calm"],
      summary: "Manual assessment required."
    };
  }
};

/**
 * New Service: Analyze PDF or Document text content
 */
export const analyzeDocument = async (content: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Analyze the following PDF/Document content related to emergency procedures or medical reports. 
  Provide a concise summary, key safety points, and a list of actionable insights.
  
  Content: "${content.substring(0, 5000)}"`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            safetyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "safetyPoints", "insights"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Document analysis error:", error);
    throw error;
  }
};
