/**
 * Text Similarity Utilities
 * Uses TF-IDF-like approach with cosine similarity
 */

// Tokenize and normalize text
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

// Create term frequency map
function termFrequency(tokens) {
  const tf = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  // Normalize by document length
  const len = tokens.length;
  Object.keys(tf).forEach(key => {
    tf[key] = tf[key] / len;
  });
  return tf;
}

// Calculate cosine similarity between two TF vectors
function cosineSimilarity(tf1, tf2) {
  const allTerms = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  allTerms.forEach(term => {
    const v1 = tf1[term] || 0;
    const v2 = tf2[term] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
}

// Calculate Jaccard similarity (word overlap)
function jaccardSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Calculate similarity between two texts
 * Returns a value between 0 and 1
 */
function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Combined score: 60% cosine + 40% jaccard
  const tf1 = termFrequency(tokens1);
  const tf2 = termFrequency(tokens2);
  
  const cosine = cosineSimilarity(tf1, tf2);
  const jaccard = jaccardSimilarity(tokens1, tokens2);

  return 0.6 * cosine + 0.4 * jaccard;
}

/**
 * Create a hash for quick duplicate detection
 * Uses sorted unique words
 */
function createSearchHash(text) {
  if (!text) return '';
  const tokens = tokenize(text);
  const unique = [...new Set(tokens)].sort();
  return unique.slice(0, 20).join('|');
}

module.exports = {
  tokenize,
  calculateSimilarity,
  createSearchHash
};
