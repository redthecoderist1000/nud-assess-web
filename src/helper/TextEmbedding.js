// import { getGenerativeModel } from "firebase-ai-logic/client"; // Assuming you're in a client-side environment for this example
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";

// Assuming 'ai' is your initialized Firebase AI Logic instance
const ai = getAI(app, { backend: new VertexAIBackend() });

async function getEmbeddings(textInput, taskType) {
  try {
    const embeddingModel = getGenerativeModel(ai, {
      model: "text-embedding-004", // This is the key change!
    });

    const response = await embeddingModel.embedContent({
      content: {
        parts: [{ text: textInput }],
        // Crucially, specify the task type for optimal relevance performance
        // Use 'RETRIEVAL_DOCUMENT' for your PDF chunks, and 'RETRIEVAL_QUERY' for your topics.
        taskType: taskType,
      },
    });

    // The response will contain the embedding vector
    return response.embedding.values; // This will be an array of numbers
  } catch (error) {
    console.error("Error getting embedding:", error);
    throw error;
  }
}

// Example usage for a PDF chunk:
async function processPdfChunk(chunkText) {
  const documentEmbedding = await getEmbeddings(
    chunkText,
    "RETRIEVAL_DOCUMENT"
  );
  console.log("Document chunk embedding:", documentEmbedding);
  return documentEmbedding;
}

// Example usage for a topic:
async function processTopic(topicText) {
  const topicEmbedding = await getEmbeddings(topicText, "RETRIEVAL_QUERY");
  console.log("Topic embedding:", topicEmbedding);
  return topicEmbedding;
}

// You would then call these functions for each PDF chunk and each topic,
// and then perform similarity calculations.

/**
 * Calculates the cosine similarity between two embedding vectors.
 *
 * @param {number[]} vectorA The first embedding vector (an array of numbers).
 * @param {number[]} vectorB The second embedding vector (an array of numbers).
 * @returns {number} The cosine similarity, a value between -1 and 1.
 *                   1 indicates perfect similarity, -1 indicates perfect dissimilarity.
 * @throws {Error} If the vectors have different lengths.
 */
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

// --- Example Usage ---

// Embeddings for "cat" and "kitten" (hypothetical, simplified)
const embeddingCat = [0.8, 0.2, 0.5];
const embeddingKitten = [0.7, 0.3, 0.6];

// Embedding for "car" (hypothetical, simplified)
const embeddingCar = [-0.1, 0.9, 0.1];

const similarityCatKitten = calculateCosineSimilarity(
  embeddingCat,
  embeddingKitten
);
console.log(`Similarity between 'cat' and 'kitten': ${similarityCatKitten}`); // Should be high, close to 1

const similarityCatCar = calculateCosineSimilarity(embeddingCat, embeddingCar);
console.log(`Similarity between 'cat' and 'car': ${similarityCatCar}`); // Should be low, possibly negative

// Example with identical vectors
const embeddingA = [1, 2, 3];
const embeddingB = [1, 2, 3];
console.log(
  `Similarity between identical vectors: ${calculateCosineSimilarity(embeddingA, embeddingB)}`
); // Should be 1

// Example with orthogonal vectors (90 degrees apart)
const embeddingC = [1, 0];
const embeddingD = [0, 1];
console.log(
  `Similarity between orthogonal vectors: ${calculateCosineSimilarity(embeddingC, embeddingD)}`
); // Should be 0
