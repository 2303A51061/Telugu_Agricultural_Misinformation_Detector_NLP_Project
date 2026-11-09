const fs = require('fs');

function parseCSV(content) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(field);
        field = '';
        if (row.length > 1 || row[0] !== '') {
          rows.push(row);
        }
        row = [];
      } else {
        field += char;
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const csvData = fs.readFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/05_NLP_Preprocessing/NLP_Preprocessed_Dataset.csv', 'utf8');
const rows = parseCSV(csvData);
const header = rows[0].map(h => h.replace(/^\uFEFF/, '').trim());
console.log('Headers:', header);
console.log('Total rows (including header):', rows.length);

const colIdx = {};
header.forEach((h, i) => colIdx[h] = i);

const labelCounts = {};
const topicCounts = {};
const samplesByLabel = { INFORMATION: [], MISINFORMATION: [] };
const textLengths = [];

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const label = (r[colIdx['label']] || '').trim();
  const topic = (r[colIdx['topic']] || 'Other').trim();
  const text = (r[colIdx['text']] || '').trim();
  const reason = (r[colIdx['reason']] || '').trim();
  const id = r[colIdx['id']];

  if (!label) continue;

  labelCounts[label] = (labelCounts[label] || 0) + 1;
  topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  textLengths.push(text.length);

  if (samplesByLabel[label] && samplesByLabel[label].length < 15) {
    samplesByLabel[label].push({ id, text, topic, label, reason });
  }
}

console.log('Label distribution:', labelCounts);
console.log('Topic distribution:', topicCounts);
console.log('Text length stats:', {
  min: Math.min(...textLengths),
  max: Math.max(...textLengths),
  avg: Math.round(textLengths.reduce((a, b) => a + b, 0) / textLengths.length)
});
console.log('First 2 INFORMATION samples:');
console.log(JSON.stringify(samplesByLabel.INFORMATION.slice(0, 2), null, 2));
console.log('First 2 MISINFORMATION samples:');
console.log(JSON.stringify(samplesByLabel.MISINFORMATION.slice(0, 2), null, 2));

fs.writeFileSync('C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/extracted_dataset_stats.json', JSON.stringify({
  totalRecords: rows.length - 1,
  labelCounts,
  topicCounts,
  samples: samplesByLabel,
  textLengthStats: {
    min: Math.min(...textLengths),
    max: Math.max(...textLengths),
    avg: Math.round(textLengths.reduce((a, b) => a + b, 0) / textLengths.length)
  }
}, null, 2), 'utf8');
