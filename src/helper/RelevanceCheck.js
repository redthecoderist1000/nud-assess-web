import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { app } from "./Firebase";

const ai = getAI(app, { backend: new VertexAIBackend() });
let controller = new AbortController();

const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      status: {
        type: "boolean",
        description:
          "true if the documents are relevant to the topics and sufficient to generate the requested number of questions, otherwise false.",
      },
    },
    required: ["status"],
  },
};

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are an expert educational question designer specialized in crafting questions across all cognitive levels of Bloom's Taxonomy. Your goal is to verify the relevance of provided documents to specified topics and whether they can be used to generate the amount of questions indicated. Be strict and return false even if one topic is not sufficiently covered or if the documents are too few to generate the requested number of questions.",
  generationConfig: generationConfig,
});

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Reads as Data URL (includes 'data:mime/type;base64,' prefix)
    reader.onload = () => resolve(reader.result.split(",")[1]); // Get only the base64 part
    reader.onerror = (error) => reject(error);
  });
}

const relevanceCheck = async (files, topics) => {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  const signal = controller.signal;

  const base64List = await Promise.all(files.map((f) => getBase64(f)));

  const parts = base64List.map((b64, i) => ({
    inlineData: {
      data: b64,
      mimeType: files[i]?.type || "application/pdf",
    },
  }));

  parts.push(...topics);

  try {
    const result = await model.generateContent(
      {
        contents: [{ role: "user", parts: parts }],
      },
      { requestOptions: { signal: signal } }
    );

    const text = result.response.text();
    try {
      const response = JSON.parse(text);
      return response; // successful parsed response
    } catch (parseErr) {
      return { raw: text, parseError: parseErr.message };
    }
  } catch (error) {
    console.log("error generating:", error);
    throw error;
  } finally {
    controller = null;
  }
};

const relevanceAbort = () => {
  console.log("aborting relevance check...");
  controller.abort();
};

export { relevanceCheck, relevanceAbort };
