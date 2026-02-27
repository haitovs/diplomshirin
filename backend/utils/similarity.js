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

// ============================================================
// Enhanced Deep Similarity Functions
// ============================================================

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that',
  'these', 'those', 'not', 'no', 'nor', 'so', 'if', 'then', 'than', 'too',
  'very', 'just', 'about', 'above', 'after', 'again', 'all', 'also', 'any',
  'because', 'before', 'between', 'both', 'each', 'few', 'more', 'most',
  'other', 'over', 'same', 'some', 'such', 'through', 'under', 'until',
  'using', 'based', 'system', 'approach', 'method', 'study', 'research',
  'analysis', 'development', 'implementation', 'design', 'application',
  'work', 'project', 'diploma', 'thesis', 'paper', 'proposed'
]);

/**
 * Enhanced tokenizer: keeps Cyrillic chars, removes stop words
 */
function tokenizeEnhanced(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04ff\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Generate word n-grams from token array
 */
function generateNgrams(tokens, n) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Jaccard similarity on n-gram sets
 */
function ngramSimilarity(tokens1, tokens2, n) {
  const ngrams1 = generateNgrams(tokens1, n);
  const ngrams2 = generateNgrams(tokens2, n);
  if (ngrams1.length === 0 || ngrams2.length === 0) return 0;

  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);
  let intersection = 0;
  for (const ng of set1) {
    if (set2.has(ng)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Calculate Inverse Document Frequency across corpus
 * @param {Array<string[]>} allDocumentTokens - array of token arrays, one per document
 */
function calculateIdf(allDocumentTokens) {
  const N = allDocumentTokens.length;
  if (N === 0) return {};
  const docFreq = {};
  for (const tokens of allDocumentTokens) {
    const unique = new Set(tokens);
    for (const term of unique) {
      docFreq[term] = (docFreq[term] || 0) + 1;
    }
  }
  const idf = {};
  for (const [term, df] of Object.entries(docFreq)) {
    idf[term] = Math.log((N + 1) / (df + 1)) + 1; // smoothed IDF
  }
  return idf;
}

/**
 * Calculate TF-IDF vector for a document
 */
function calculateTfIdfVector(tokens, idf) {
  const tf = {};
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  const len = tokens.length || 1;
  const tfidf = {};
  for (const [term, count] of Object.entries(tf)) {
    tfidf[term] = (count / len) * (idf[term] || 1);
  }
  return tfidf;
}

/**
 * Longest Common Subsequence ratio (space-optimized to 2 rows)
 */
function lcsRatio(tokens1, tokens2) {
  const m = tokens1.length;
  const n = tokens2.length;
  if (m === 0 || n === 0) return 0;

  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (tokens1[i - 1] === tokens2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
    curr.fill(0);
  }

  const lcsLen = prev[n];
  return (2 * lcsLen) / (m + n);
}

/**
 * Deep similarity combining multiple methods
 * Weights: 30% TF-IDF Cosine + 15% Jaccard + 20% Bigram + 15% Trigram + 20% LCS
 * @param {string} text1
 * @param {string} text2
 * @param {Array<string[]>} [allDocumentTokens] - corpus for IDF (optional)
 * @returns {{ overall: number, breakdown: Object }}
 */
function calculateDeepSimilarity(text1, text2, allDocumentTokens) {
  if (!text1 || !text2) return { overall: 0, breakdown: {} };

  const tokens1 = tokenizeEnhanced(text1);
  const tokens2 = tokenizeEnhanced(text2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return { overall: 0, breakdown: {} };
  }

  // Build corpus IDF (include the two texts if no corpus provided)
  const corpus = allDocumentTokens && allDocumentTokens.length > 0
    ? allDocumentTokens
    : [tokens1, tokens2];
  const idf = calculateIdf(corpus);

  // TF-IDF Cosine
  const tfidf1 = calculateTfIdfVector(tokens1, idf);
  const tfidf2 = calculateTfIdfVector(tokens2, idf);
  const tfidfCosine = cosineSimilarity(tfidf1, tfidf2);

  // Jaccard
  const jaccard = jaccardSimilarity(tokens1, tokens2);

  // Bigram similarity
  const bigram = ngramSimilarity(tokens1, tokens2, 2);

  // Trigram similarity
  const trigram = ngramSimilarity(tokens1, tokens2, 3);

  // LCS ratio
  const lcs = lcsRatio(tokens1, tokens2);

  const overall = 0.30 * tfidfCosine + 0.15 * jaccard + 0.20 * bigram + 0.15 * trigram + 0.20 * lcs;

  return {
    overall,
    breakdown: {
      tfidfCosine: Math.round(tfidfCosine * 100),
      jaccard: Math.round(jaccard * 100),
      bigram: Math.round(bigram * 100),
      trigram: Math.round(trigram * 100),
      lcs: Math.round(lcs * 100),
    },
  };
}

/**
 * Compare input fields against a database work's fields
 * Returns title, description, and combined similarity
 */
function compareFields(inputFields, dbWorkFields, allDocumentTokens) {
  const titleResult = calculateDeepSimilarity(
    inputFields.title || '',
    dbWorkFields.title || '',
    allDocumentTokens
  );

  const descResult = calculateDeepSimilarity(
    inputFields.description || '',
    dbWorkFields.description || '',
    allDocumentTokens
  );

  const inputCombined = [inputFields.title, inputFields.description, inputFields.fullText]
    .filter(Boolean).join(' ');
  const dbCombined = [dbWorkFields.title, dbWorkFields.description, dbWorkFields.fullText]
    .filter(Boolean).join(' ');
  const combinedResult = calculateDeepSimilarity(inputCombined, dbCombined, allDocumentTokens);

  return {
    title: { score: Math.round(titleResult.overall * 100), methods: titleResult.breakdown },
    description: { score: Math.round(descResult.overall * 100), methods: descResult.breakdown },
    combined: { score: Math.round(combinedResult.overall * 100), methods: combinedResult.breakdown },
  };
}

module.exports = {
  tokenize,
  calculateSimilarity,
  createSearchHash,
  // Enhanced exports
  STOP_WORDS,
  tokenizeEnhanced,
  generateNgrams,
  ngramSimilarity,
  calculateIdf,
  calculateTfIdfVector,
  lcsRatio,
  calculateDeepSimilarity,
  compareFields,
};
