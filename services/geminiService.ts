import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists to prevent immediate crashes
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBio = async (currentBio: string, tone: string = 'sophisticated'): Promise<string> => {
  if (!ai) throw new Error("API Key missing");
  
  const modelId = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Rewrite the following photographer biography to be more ${tone}, minimalist, and professional. Keep it concise (under 100 words). \n\nOriginal Bio: ${currentBio}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for simple text tasks
      }
    });
    return response.text || currentBio;
  } catch (error) {
    console.error("Gemini Bio Error:", error);
    throw error;
  }
};

export const generateImageCaption = async (base64Image: string): Promise<{title: string, description: string}> => {
  if (!ai) throw new Error("API Key missing");

  // Remove data URL prefix if present for the API call
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using appropriate vision model
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, practically handles most
              data: cleanBase64
            }
          },
          {
            text: "Analyze this photograph. Provide a short, artistic title (max 5 words) and a poetic, minimalist description (1 sentence) suitable for a high-end photography portfolio. Return ONLY a valid JSON object with keys 'title' and 'description'. Do not include markdown formatting."
          }
        ]
      }
    });

    const text = response.text;
    if (!text) return { title: "Untitled", description: "No description generated." };
    
    // Robust JSON extraction
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr);
    }
    
    // Fallback if no JSON found
    return { title: "Untitled", description: text.slice(0, 100) };

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { title: "Untitled", description: "Could not analyze image." };
  }
};