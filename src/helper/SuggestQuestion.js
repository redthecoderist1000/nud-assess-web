import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { app } from "./Firebase";

const ai = getAI(app, { backend: new VertexAIBackend() });

const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "string",
    title: "SuggestedQuestion",
    description:
      "A well-structured question aligned with the specified cognitive level.",
    required: ["suggested_question"],
  },
};

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are an expert educational question designer specialized in crafting questions across all cognitive levels of Bloom's Taxonomy. Re-phrase and enhance the provided question to align perfectly with the specified cognitive level, ensuring clarity, relevance, and depth. Your goal is to create questions that not only assess knowledge but also stimulate critical thinking and understanding according to the cognitive level indicated.",
  generationConfig: generationConfig,
});

const suggestQuestion = async (cognitive_level, current_question) => {
  const prompt = `Re-phrase the question to be a ${cognitive_level} question. Current question: ${current_question}.`;

  try {
    const res = await model.generateContent({
      contents: [{ role: "user", parts: { text: prompt } }],
    });
    // console.log(response);
    const result = res.response.text();
    const response = JSON.parse(result);

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export default suggestQuestion;
