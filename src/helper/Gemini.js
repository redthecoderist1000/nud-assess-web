import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { app } from "./Firebase";

const controller = new AbortController();
const signal = controller.signal;

const ai = getAI(app, { backend: new VertexAIBackend() });

const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "object", // The root is now an object
    properties: {
      questions: {
        type: "array",
        description:
          "A list of generated questions, each structured according to Bloom's Taxonomy.",
        items: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description:
                "The topic for the question as stated in the prompt.",
            },
            lesson_id: {
              type: "string",
              description:
                "A unique identifier for the lesson as stated in the prompt.",
            },
            question: {
              type: "string",
              description: "The text of the generated question.",
            },
            specification: {
              type: "string",
              description: "The cognitive level as stated in the prompt.",
            },
            answers: {
              type: "array",
              description: "An array of possible answers for the question.",
              items: {
                type: "object",
                properties: {
                  answer: {
                    type: "string",
                    description: "The text of a possible answer.",
                  },
                  is_correct: {
                    type: "boolean",
                    description:
                      "True if this is the correct answer, false otherwise.",
                  },
                },
                required: ["answer", "is_correct"],
              },
            },
            ai_generated: {
              type: "boolean",
              description:
                "Indicates if the question was AI-generated. Always true.",
            },
          },
          required: [
            "question",
            "answers",
            "specification",
            "topic",
            "lesson_id",
            "ai_generated",
          ],
        },
      },
    },
    required: ["questions"], // Both 'status' and 'questions' are required properties of the root object
  },
};

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are an expert educational question designer specialized in crafting questions across all cognitive levels of Bloom's Taxonomy. Your goal is to generate questions that assess understanding, application, analysis, evaluation, and creation, using varied phrasing and keywords appropriate for each level. The structure of the quiz will be based on the specifications per lessons given in the prompt. Ensure that all of the contents in the questions are present in the files provided, but do not mention in the question that you are referring to some files. For each questions, provide 4 multiple choices with only one correct answer. Include the specification according to the Bloom's Taxonomy Cognitive Domain, and the lesson as well as the lesson id which the question came from. Avoid using phrases like 'based on the provided documents' in the questions. Be concise and clear in your questions and answer choices.",
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

async function aiRun(files, prompt) {
  const base64List = await Promise.all(files.map((f) => getBase64(f)));

  const parts = base64List.map((b64, i) => ({
    inlineData: {
      data: b64,
      mimeType: files[i]?.type || "application/pdf",
    },
  }));

  // Add your text prompt to the parts array
  parts.push(...prompt);

  // Call generateContent with the multimodal input
  try {
    const result = await model.generateContent(
      {
        contents: [{ role: "user", parts: parts }],
      },
      { requestOptions: { signal } }
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
  }
}

const aiAbort = () => {
  console.log("aborting ai generation...");
  controller.abort();
};

export { aiRun, aiAbort };
