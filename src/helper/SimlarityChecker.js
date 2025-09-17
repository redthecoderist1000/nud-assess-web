import { GoogleGenerativeAI } from "@google/generative-ai";

import { supabase } from "./Supabase";

const env = import.meta.env;

const genAI = new GoogleGenerativeAI(env.VITE_GOOGLE_APIKEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

function calculateCosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error(
      "Vectors must have the same length to calculate cosine similarity."
    );
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]; // Sum of (A[i] * B[i])
    magnitudeA += vectorA[i] * vectorA[i]; // Sum of (A[i] squared)
    magnitudeB += vectorB[i] * vectorB[i]; // Sum of (B[i] squared)
  }

  // Calculate the magnitudes (square root of the sums)
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // If either magnitude is zero, it means one of the vectors is a zero vector,
  // which can lead to division by zero. In such cases, similarity is typically 0.
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // Cosine Similarity = (A . B) / (||A|| * ||B||)
  return dotProduct / (magnitudeA * magnitudeB);
}

const fetchQuestions = async (blooms_category, repository, lesson_id) => {
  const { data: questionData, error: questionError } = await supabase
    .from("tbl_question")
    .select("id, question")
    .eq("blooms_category", blooms_category)
    .eq("repository", repository)
    .eq("lesson_id", lesson_id);

  if (questionError) {
    return { error: questionError };
  }

  const questionsWithEmbeddings = await Promise.all(
    questionData.map(async (question) => {
      const embedding = await embeddingModel.embedContent({
        content: {
          parts: [{ text: question.question }],
        },
        taskType: "RETRIEVAL_QUERY",
      });
      return { ...question, embedding };
    })
  );

  return { data: questionsWithEmbeddings, error: null };
};

// question: data.question,
// blooms_category: data.specification,
// repository: data.repository,
// lesson_id: lesson,

const similarityCheck = async (
  question,
  blooms_category,
  repository,
  lesson_id
) => {
  const { data: questions, error } = await fetchQuestions(
    blooms_category,
    repository,
    lesson_id
  );

  if (error) {
    return { error: error };
  }

  const baseEmbedding = await embeddingModel.embedContent({
    content: {
      parts: [{ text: question }],
    },
    taskType: "RETRIEVAL_QUERY",
  });

  const questionWithCosine = await Promise.all(
    questions.map(async (q) => {
      const similarity = calculateCosineSimilarity(
        baseEmbedding.embedding.values,
        q.embedding.embedding.values
      );
      return { id: q.id, question: q.question, similarity };
    })
  );

  const threshold = 0.7;

  const filteredQuestions = questionWithCosine.filter(
    (q) => q.similarity >= threshold
  );

  return { data: filteredQuestions, error: null };
};

export { similarityCheck };
