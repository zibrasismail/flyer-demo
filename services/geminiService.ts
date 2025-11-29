import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateProductInsight = async (product: Product): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API Key not configured. Unable to generate insight.";
  }

  try {
    const prompt = `
      You are a helpful retail assistant for Home Hardware.
      Write a short, catchy, 2-sentence sales pitch for the following product.
      Focus on value and utility.
      
      Product: ${product.name}
      Brand: ${product.brand}
      Price: $${product.price} (On Sale from $${product.originalPrice})
      Description: ${product.description}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insight available.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Currently unable to generate AI insight.";
  }
};
