
import { GoogleGenAI, Type } from "@google/genai";
import { Curriculum, GenerationParams } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCurriculum(params: GenerationParams): Promise<Curriculum> {
  const prompt = `
    Design a comprehensive, high-quality academic curriculum for the following:
    Subject: ${params.subject}
    Academic Level: ${params.level}
    Intended Duration: ${params.duration}
    Focus Areas: ${params.focus}
    Industry Alignment: ${params.industryAlignment ? "Strongly emphasize industry-relevant skills and practical applications." : "Standard academic approach."}

    The response must be a structured JSON object detailing the course title, a professional description, specific learning outcomes, a series of modules with detailed topics and individual durations, an assessment strategy, and specific recommendations for optimization.
  `;

  // Using gemini-3-pro-preview for complex reasoning and structured curriculum generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          level: { type: Type.STRING },
          totalDuration: { type: Type.STRING },
          learningOutcomes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                mappedModules: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "text", "mappedModules"]
            }
          },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "title", "description", "duration", "topics"]
            }
          },
          assessmentStrategy: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "learningOutcomes", "modules", "assessmentStrategy"]
      }
    },
  });

  try {
    // response.text is a property, not a method
    const data = JSON.parse(response.text || "{}");
    return data as Curriculum;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid curriculum data received from AI.");
  }
}
