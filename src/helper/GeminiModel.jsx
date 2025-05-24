import {
  createPartFromUri,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const env = import.meta.env;

const genAI = new GoogleGenerativeAI(env.VITE_GEMINI_API);
const ai = new GoogleGenAI({ apiKey: env.VITE_GEMINI_API });

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 25000,
  responseMimeType: "application/json",
  responseSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        topic: {
          type: "string",
        },
        lesson_id: {
          type: "string",
        },
        question: {
          type: "string",
        },
        specification: {
          type: "string",
        },
        answers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              answer: {
                type: "string",
              },
              is_correct: {
                type: "boolean",
              },
            },
            required: ["answer", "is_correct"],
          },
        },
      },
      required: ["question", "answers", "specification", "topic", "lesson_id"],
    },
  },
};

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction:
    "Create a quiz where the questions falls under the Bloom's Taxonomy Cognitive Domain. The structure of the quiz will be based on the specifications per lessons given in the prompt. Ensure that all of the contents in the quiz are present in the document provided. For each questions, provide 4 multiple choices with only one correct answer. Include the specification according to the Bloom's Taxonomy Cognitive Domain, and the lesson as well as the lesson id which the question came from.",
  generationConfig: generationConfig,
});
