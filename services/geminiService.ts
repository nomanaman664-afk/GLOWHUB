
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are "GlowHub Assistant", the AI concierge for GlowHub - the ultimate global platform for beauty and grooming.
Your goal is to help users find salons, book barbers, or buy/sell beauty products.

Tone & Style:
- Professional, helpful, and polite.
- Culturally aware of the user's location (currently focused on Pakistan, e.g., "Shadi Season", "Eid Prep").
- Concise and direct.

Tasks:
1. **Service Search**: If a user asks for a barber, ask for their location.
2. **Product Advice**: Suggest marketplace items based on trends.
3. **Trends**: Know about local trends (e.g., Glass Skin, Fades).
`;

export const getAIRecommendation = async (prompt: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: `User Context: ${context}
      User Query: ${prompt}
      
      Respond concisely (max 3 sentences).`,
    });
    return response.text || "I'm focusing on finding the best options for you. Could you try asking again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My connection to the server is a bit weak right now. Please check your internet.";
  }
};

export const generateProductDescription = async (productTitle: string, category: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a savvy seller on a beauty marketplace. Write a short, persuasive, and catchy description (30-40 words) to sell a beauty item fast. Use bullet points or emojis. Mention condition.",
            },
            contents: `Write a sales description for: "${productTitle}" in category: "${category}".`
        });
        return response.text || "Excellent condition. DM for price and details!";
    } catch (e) {
        return "Great quality product available for sale. Contact for details.";
    }
}
