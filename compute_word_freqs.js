const fs = require('fs');

const stats = JSON.parse(fs.readFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/extracted_dataset_stats.json', 'utf8'));

// Read tokens from CSV
const csvData = fs.readFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/05_NLP_Preprocessing/NLP_Preprocessed_Dataset.csv', 'utf8');

// Simple regex to get Telugu words
const teluguWords = csvData.match(/[\u0C00-\u0C7F]+/gu) || [];
const wordFreq = {};
// Exclude basic column headers if matched
const headers = new Set(['id', 'text', 'topic', 'label', 'source_type', 'source_reference', 'reason', 'final_label', 'normalized_text', 'tokens', 'token_count', 'tokens_no_stopwords', 'nlp_text', 'nlp_text_no_stopwords']);

for (const w of teluguWords) {
  if (w.length > 1) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
}

const topWords = Object.entries(wordFreq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .map(([word, count]) => ({ word, count }));

stats.topWords = topWords;

// Topic breakdown by label
const topicByLabel = {};
const lines = csvData.split(/\r?\n/);
const header = lines[0].split(',');
// Let's compute topic by label from rows
const rows = JSON.parse(fs.readFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/extracted_dataset_stats.json', 'utf8'));

fs.writeFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/extracted_dataset_stats.json', JSON.stringify(stats, null, 2), 'utf8');
console.log('Top 15 Telugu Words:', topWords.slice(0, 15));
