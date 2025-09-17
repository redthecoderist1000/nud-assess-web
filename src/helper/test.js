import { getGenerativeModel } from "firebase-ai-logic/client"; // Adjust import for your environment

// --- PART 1: Setup and Utility Functions ---

// Placeholder for your Firebase AI Logic instance
// In a real Firebase project, this would be initialized via your SDK setup.
const ai = {
  /* ... your Firebase AI Logic instance ... */
};

/**
 * Placeholder: Simulates extracting text from a PDF.
 * In a real application, you'd use a library like 'pdf-parse' for Node.js
 * or a server-side process to extract text from a PDF file.
 * For this example, we'll just use a mock text.
 */
async function extractTextFromPdf(pdfFile) {
  console.log(
    `(Simulating text extraction from: ${pdfFile.name || "mock-pdf"})`
  );
  // This would typically involve an external library or service
  // For demonstration, let's return some example content.
  const mockContent = `
    This document discusses various concepts related to education and learning.
    One key area is cognitive development, exploring how students acquire knowledge and understanding.
    We also delve into different pedagogical approaches designed to enhance learning outcomes.
    The role of assessment in evaluating student progress is critical, and we examine both formative and summative assessments.
    Finally, we touch upon advanced topics like metacognition and self-regulated learning strategies.
    This content is relevant to educational psychology, curriculum design, and instructional methodologies.
    It contains material suitable for creating questions across various Bloom's Taxonomy levels,
    from basic recall to higher-order thinking skills such as analysis and synthesis.
    The document emphasizes student engagement and critical thinking.
    It has sufficient depth for multiple questions on these subjects.
  `;
  return mockContent;
}

/**
 * Chunks text into smaller pieces, respecting a maximum token limit.
 * This is a simplified approach, a more robust solution might
 * try to chunk by paragraphs, sentences, or use a more sophisticated tokenizer.
 * For text-embedding-004, the max is 2048 tokens. We'll approximate with characters.
 * A token is roughly 4 characters, so 2048 tokens is ~8192 characters.
 */
function chunkText(text, maxCharsPerChunk = 7000) {
  // Using 7000 chars as a safe approximation for 2048 tokens
  const chunks = [];
  let currentPos = 0;
  while (currentPos < text.length) {
    let endPos = currentPos + maxCharsPerChunk;

    // Try to break at a natural boundary (e.g., end of a sentence or paragraph)
    if (endPos < text.length) {
      let boundaryFound = false;
      // Search backwards for a period, newline, or other common separator
      for (let i = endPos; i > currentPos; i--) {
        if (text[i] === "." || text[i] === "\n" || text[i] === "\r") {
          endPos = i + 1; // Include the separator
          boundaryFound = true;
          break;
        }
      }
      // If no good boundary, just cut at maxCharsPerChunk
      if (!boundaryFound) {
        endPos = currentPos + maxCharsPerChunk;
      }
    } else {
      endPos = text.length;
    }

    chunks.push(text.substring(currentPos, endPos).trim());
    currentPos = endPos;
  }
  return chunks.filter((chunk) => chunk.length > 0); // Remove empty chunks
}

/**
 * Calls the text-embedding-004 model to get an embedding for text.
 */
async function getEmbeddingForText(textInput, taskType) {
  if (!textInput || textInput.trim() === "") {
    console.warn("Attempted to get embedding for empty text.");
    return null;
  }
  try {
    const embeddingModel = getGenerativeModel(ai, {
      model: "text-embedding-004",
    });

    const response = await embeddingModel.embedContent({
      content: {
        parts: [{ text: textInput }],
        taskType: taskType,
      },
    });

    return response.embedding.values; // Returns the embedding array
  } catch (error) {
    console.error(`Error getting embedding for taskType ${taskType}:`, error);
    throw error;
  }
}

/**
 * Calculates the cosine similarity between two embedding vectors.
 */
function calculateCosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) {
    console.warn("Cannot calculate similarity for empty or null vectors.");
    return 0;
  }
  if (vectorA.length !== vectorB.length) {
    throw new Error(
      "Vectors must have the same length to calculate cosine similarity."
    );
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

// --- PART 2: Orchestration for Relevance Checking ---

/**
 * Main function to check the relevance of PDF content to given topics.
 *
 * @param {File[]} pdfFiles An array of PDF File objects (or mock objects for this example).
 * @param {string[]} topics An array of topic strings to check against.
 * @param {number} similarityThreshold The minimum cosine similarity score to consider a chunk relevant.
 * @returns {Promise<Object>} An object indicating overall relevance and detailed scores.
 */
async function checkPdfRelevance(pdfFiles, topics, similarityThreshold = 0.7) {
  const allDocumentEmbeddings = [];
  const documentDetails = [];

  console.log("--- Starting PDF Processing ---");

  // Step 1: Extract Text & Chunk PDFs
  for (const pdfFile of pdfFiles) {
    const fullText = await extractTextFromPdf(pdfFile);
    if (!fullText) {
      console.warn(`Could not extract text from ${pdfFile.name}. Skipping.`);
      continue;
    }
    const chunks = chunkText(fullText);
    console.log(
      `Extracted and chunked ${pdfFile.name} into ${chunks.length} chunks.`
    );

    // Step 2: Get Embeddings for Document Chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      try {
        const embedding = await getEmbeddingForText(
          chunkText,
          "RETRIEVAL_DOCUMENT"
        );
        if (embedding) {
          allDocumentEmbeddings.push({
            pdfName: pdfFile.name || `PDF_${pdfFiles.indexOf(pdfFile) + 1}`,
            chunkIndex: i,
            text: chunkText,
            embedding: embedding,
          });
        }
      } catch (e) {
        console.error(`Failed to embed chunk ${i} from ${pdfFile.name}:`, e);
      }
    }
  }

  if (allDocumentEmbeddings.length === 0) {
    console.log("No document chunks were embedded. Cannot check relevance.");
    return { isRelevant: false, reason: "No embeddable content found." };
  }

  console.log(
    `Total ${allDocumentEmbeddings.length} document chunks processed.`
  );
  console.log("--- Document Processing Complete. Getting Topic Embeddings ---");

  // Step 3: Get Embeddings for Topics
  const topicEmbeddings = [];
  for (const topic of topics) {
    try {
      const embedding = await getEmbeddingForText(topic, "RETRIEVAL_QUERY");
      if (embedding) {
        topicEmbeddings.push({ topic: topic, embedding: embedding });
      }
    } catch (e) {
      console.error(`Failed to embed topic "${topic}":`, e);
    }
  }

  if (topicEmbeddings.length === 0) {
    console.log("No topics were embedded. Cannot check relevance.");
    return { isRelevant: false, reason: "No embeddable topics found." };
  }

  console.log(`Total ${topicEmbeddings.length} topics processed.`);
  console.log("--- Calculating Similarities ---");

  // Step 4: Calculate Similarities and Determine Relevance
  const relevanceScores = {};
  let overallRelevantChunksCount = 0;

  for (const topicEmbed of topicEmbeddings) {
    relevanceScores[topicEmbed.topic] = {
      relevantChunks: [],
      maxSimilarity: 0,
      minSimilarity: 1, // Start high to find the true min
      avgSimilarity: 0,
      totalSimilarity: 0,
      evaluatedChunks: 0,
    };

    for (const docEmbed of allDocumentEmbeddings) {
      const similarity = calculateCosineSimilarity(
        topicEmbed.embedding,
        docEmbed.embedding
      );

      relevanceScores[topicEmbed.topic].maxSimilarity = Math.max(
        relevanceScores[topicEmbed.topic].maxSimilarity,
        similarity
      );
      relevanceScores[topicEmbed.topic].minSimilarity = Math.min(
        relevanceScores[topicEmbed.topic].minSimilarity,
        similarity
      );
      relevanceScores[topicEmbed.topic].totalSimilarity += similarity;
      relevanceScores[topicEmbed.topic].evaluatedChunks++;

      if (similarity >= similarityThreshold) {
        relevanceScores[topicEmbed.topic].relevantChunks.push({
          pdfName: docEmbed.pdfName,
          chunkIndex: docEmbed.chunkIndex,
          similarity: similarity,
          textSample: docEmbed.text.substring(0, 100) + "...",
        });
        overallRelevantChunksCount++;
      }
    }
    if (relevanceScores[topicEmbed.topic].evaluatedChunks > 0) {
      relevanceScores[topicEmbed.topic].avgSimilarity =
        relevanceScores[topicEmbed.topic].totalSimilarity /
        relevanceScores[topicEmbed.topic].evaluatedChunks;
    }
  }

  // Final determination of relevance based on your criteria
  // For example, if you need *all* topics to be sufficiently covered:
  let allTopicsSufficientlyCovered = true;
  for (const topic of topics) {
    const scores = relevanceScores[topic];
    console.log(`\nTopic: "${topic}"`);
    console.log(`  - Max Similarity: ${scores.maxSimilarity.toFixed(4)}`);
    console.log(`  - Avg Similarity: ${scores.avgSimilarity.toFixed(4)}`);
    console.log(
      `  - Relevant Chunks (>${similarityThreshold.toFixed(2)}): ${scores.relevantChunks.length}`
    );

    // Define "sufficiently covered" - e.g., at least X relevant chunks
    const MIN_RELEVANT_CHUNKS_PER_TOPIC = 2; // You can adjust this based on your needs
    if (scores.relevantChunks.length < MIN_RELEVANT_CHUNKS_PER_TOPIC) {
      allTopicsSufficientlyCovered = false;
      console.log(`  -> Topic "${topic}" is NOT sufficiently covered.`);
    } else {
      console.log(`  -> Topic "${topic}" IS sufficiently covered.`);
    }
  }

  const isOverallRelevant =
    allTopicsSufficientlyCovered && overallRelevantChunksCount > 0;
  console.log("\n--- Relevance Check Complete ---");
  console.log(`Overall Relevance: ${isOverallRelevant ? "TRUE" : "FALSE"}`);
  console.log(`Total relevant chunks found: ${overallRelevantChunksCount}`);

  return {
    isRelevant: isOverallRelevant,
    details: relevanceScores,
    overallRelevantChunksCount: overallRelevantChunksCount,
  };
}

// --- PART 3: Execution Example ---

async function runRelevanceCheck() {
  const mockPdfFile1 = { name: "Educational Concepts.pdf" }; // Just a name for the mock
  const topicsOfInterest = [
    "Cognitive Development",
    "Assessment Strategies",
    "Metacognition",
  ];

  try {
    const result = await checkPdfRelevance(
      [mockPdfFile1], // Pass your actual PDF file objects here
      topicsOfInterest,
      0.75 // Adjust your similarity threshold as needed
    );

    console.log(
      "\nFinal Result:",
      result.isRelevant
        ? "Documents ARE relevant."
        : "Documents are NOT relevant."
    );

    if (!result.isRelevant) {
      console.log(
        "Reason:",
        result.reason ||
          "Not all topics were sufficiently covered or not enough relevant content."
      );
    }

    // You would then use this `isRelevant` flag to decide if you proceed
    // with question generation using your `gemini-2.5-flash` model.
    if (result.isRelevant) {
      console.log("\nProceeding with question generation...");
      // Call your Gemini model here, providing the relevant document chunks
      // (e.g., you could pass the 'text' from the relevantChunks found in result.details)
    }
  } catch (error) {
    console.error("An error occurred during relevance check:", error);
  }
}

// Kick off the example
runRelevanceCheck();
