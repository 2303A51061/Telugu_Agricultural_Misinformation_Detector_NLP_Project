const fs = require('fs');
const path = require('path');

// Robust Python Pickle Protocol 4 deserializer in pure Node.js
function unpickle(buf) {
  let pos = 0;
  const stack = [];
  const memo = {};
  const marks = [];

  function readByte() { return buf[pos++]; }
  function readBytes(n) { const s = buf.slice(pos, pos + n); pos += n; return s; }
  function readInt32() { const v = buf.readInt32LE(pos); pos += 4; return v; }
  function readUInt32() { const v = buf.readUInt32LE(pos); pos += 4; return v; }
  function readFloat64() { const v = buf.readDoubleLE(pos); pos += 8; return v; }

  while (pos < buf.length) {
    const op = buf[pos++];
    if (op === 0x80) { pos++; } // PROTO
    else if (op === 0x95) { pos += 8; } // FRAME
    else if (op === 0x8c) { stack.push(readBytes(readByte()).toString('utf8')); }
    else if (op === 0x8d) { stack.push(readBytes(readUInt32()).toString('utf8')); }
    else if (op === 0x63) {
      let nl1 = buf.indexOf(10, pos); let mod = buf.slice(pos, nl1).toString('utf8'); pos = nl1 + 1;
      let nl2 = buf.indexOf(10, pos); let name = buf.slice(pos, nl2).toString('utf8'); pos = nl2 + 1;
      stack.push({ __global__: mod + '.' + name });
    } else if (op === 0x93) {
      const name = stack.pop(); const mod = stack.pop();
      stack.push({ __global__: mod + '.' + name });
    } else if (op === 0x29) { stack.push([]); }
    else if (op === 0x7d) { stack.push({}); }
    else if (op === 0x5d) { stack.push([]); }
    else if (op === 0x8f) { stack.push(new Set()); }
    else if (op === 0x28) { marks.push(stack.length); }
    else if (op === 0x74) { stack.push(stack.splice(marks.pop())); }
    else if (op === 0x85) { stack.push([stack.pop()]); }
    else if (op === 0x86) { const b = stack.pop(); stack.push([stack.pop(), b]); }
    else if (op === 0x87) { const c = stack.pop(); const b = stack.pop(); stack.push([stack.pop(), b, c]); }
    else if (op === 0x71) { memo[readByte()] = stack[stack.length - 1]; }
    else if (op === 0x72) { memo[readUInt32()] = stack[stack.length - 1]; }
    else if (op === 0x94) { memo[Object.keys(memo).length] = stack[stack.length - 1]; }
    else if (op === 0x68) { stack.push(memo[readByte()]); }
    else if (op === 0x6a) { stack.push(memo[readUInt32()]); }
    else if (op === 0x4b) { stack.push(readByte()); }
    else if (op === 0x4d) { const v = buf.readUInt16LE(pos); pos += 2; stack.push(v); }
    else if (op === 0x4a) { stack.push(readInt32()); }
    else if (op === 0x47) { const v = buf.readDoubleBE(pos); pos += 8; stack.push(v); }
    else if (op === 0x89) { stack.push(false); }
    else if (op === 0x88) { stack.push(true); }
    else if (op === 0x4e) { stack.push(null); }
    else if (op === 0x75) {
      const items = stack.splice(marks.pop());
      const dict = stack[stack.length - 1];
      for (let i = 0; i < items.length; i += 2) dict[items[i]] = items[i + 1];
    } else if (op === 0x73) {
      const val = stack.pop(); const key = stack.pop();
      stack[stack.length - 1][key] = val;
    } else if (op === 0x52) {
      const args = stack.pop(); const func = stack.pop();
      stack.push({ __call__: func, args });
    } else if (op === 0x81) {
      const args = stack.pop(); const cls = stack.pop();
      stack.push({ __cls__: cls, args });
    } else if (op === 0x92) {
      const kwargs = stack.pop(); const args = stack.pop(); const cls = stack.pop();
      stack.push({ __cls__: cls, args, kwargs });
    } else if (op === 0x62) {
      const state = stack.pop();
      stack[stack.length - 1].__state__ = state;
    } else if (op === 0x2e) { break; }
    else if (op === 0x43) { stack.push(readBytes(readByte())); }
    else if (op === 0x42) { stack.push(readBytes(readUInt32())); }
    else if (op === 0x46) {
      let nl = buf.indexOf(10, pos);
      stack.push(parseFloat(buf.slice(pos, nl).toString('ascii')));
      pos = nl + 1;
    } else if (op === 0x49) {
      let nl = buf.indexOf(10, pos);
      stack.push(parseInt(buf.slice(pos, nl).toString('ascii'), 10));
      pos = nl + 1;
    } else if (op === 0x65) {
      const items = stack.splice(marks.pop());
      const list = stack[stack.length - 1];
      items.forEach(it => list.push(it));
    } else if (op === 0x61) {
      stack[stack.length - 1].push(stack.pop());
    } else {
      console.log('Unknown op: 0x' + op.toString(16) + ' at pos', pos - 1);
      break;
    }
  }
  return stack[0];
}

function extractNumpyArray(obj) {
  // Numpy ndarray reconstructed with state: [version, shape, dtype, is_fortran, raw_data_buffer_or_list]
  if (obj && obj.__state__) {
    const raw = obj.__state__[4];
    if (Buffer.isBuffer(raw)) {
      const shape = obj.__state__[1];
      const count = shape.reduce((a, b) => a * b, 1);
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push(raw.readDoubleLE(i * 8));
      }
      return arr;
    } else if (Array.isArray(raw)) {
      return raw;
    }
  }
  return [];
}

const baseDir = 'C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project';

console.log('Reading pickle files...');
const tfidfObj = unpickle(fs.readFileSync(path.join(baseDir, '06_TFIDF_Feature_Extraction/TFIDF_Vectorizer.pkl')));
const lrObj = unpickle(fs.readFileSync(path.join(baseDir, '07_Machine_Learning/Logistic_Regression_Model.pkl')));

const transformer = tfidfObj.__state__._tfidf;
const idfArray = extractNumpyArray(transformer.__state__.idf_);
console.log('IDF weights count:', idfArray.length);

const rawVocab = tfidfObj.__state__.vocabulary_;
const vocabulary = {};
for (const [k, v] of Object.entries(rawVocab)) {
  if (typeof v === 'number') {
    vocabulary[k] = v;
  } else if (v && v.args && Buffer.isBuffer(v.args[1])) {
    vocabulary[k] = Number(v.args[1].readBigInt64LE(0));
  } else if (v && v.args && typeof v.args[0] === 'number') {
    vocabulary[k] = v.args[0];
  } else if (v && v.args && Buffer.isBuffer(v.args[0])) {
    vocabulary[k] = v.args[0].readInt32LE(0);
  }
}
console.log('Cleaned vocabulary entries count:', Object.keys(vocabulary).length);
console.log('Cleaned vocabulary entries count:', Object.keys(vocabulary).length);

const lrClasses = lrObj.__state__.classes_.__state__[4];
console.log('LR classes:', lrClasses);

const lrIntercept = extractNumpyArray(lrObj.__state__.intercept_)[0];
console.log('LR intercept:', lrIntercept);

const lrCoef = extractNumpyArray(lrObj.__state__.coef_);
console.log('LR coef count:', lrCoef.length);

// Exact Telugu preprocessing from Step 5 & Step 12
function preprocessText(text) {
  text = String(text || '');
  text = text.normalize('NFC');
  text = text.replace(/\s+/g, ' ');
  return text.trim();
}

// Scikit-learn TfidfVectorizer transform simulation:
// 1) Tokenize text into words using (?u)\b\w+\b
// 2) Generate 1-grams and 2-grams (ngram_range=(1, 2))
// 3) Count term frequencies for vocabulary items
// 4) Multiply by IDF
// 5) Apply L2 normalization
function transformTfidf(text) {
  const cleaned = preprocessText(text);
  // Match Python regex r'(?u)\b\w+\b' using unicode word characters
  // In JS, \p{L}\p{N} or matching telugu/alphanumeric tokens
  // Note: Python \w matches [^\W] which includes Telugu characters and numbers/letters
  const tokens = cleaned.match(/[\p{L}\p{N}_]+/gu) || [];
  
  const tf = new Map();
  // Unigrams
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (vocabulary.hasOwnProperty(token)) {
      const idx = vocabulary[token];
      tf.set(idx, (tf.get(idx) || 0) + 1);
    }
  }
  // Bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = tokens[i] + ' ' + tokens[i + 1];
    if (vocabulary.hasOwnProperty(bigram)) {
      const idx = vocabulary[bigram];
      tf.set(idx, (tf.get(idx) || 0) + 1);
    }
  }

  // Multiply by IDF
  const vector = new Map();
  let sumSq = 0;
  for (const [idx, count] of tf.entries()) {
    const val = count * idfArray[idx];
    vector.set(idx, val);
    sumSq += val * val;
  }

  // L2 normalize
  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (const [idx, val] of vector.entries()) {
      vector.set(idx, val / norm);
    }
  }

  return vector;
}

// Predict using Logistic Regression
function predictNews(newsText) {
  const vector = transformTfidf(newsText);

  // Compute dot product of sparse vector and lrCoef
  let z = lrIntercept;
  for (const [idx, val] of vector.entries()) {
    z += val * lrCoef[idx];
  }

  // Logistic sigmoid: P(y=1) where classes = ['INFORMATION', 'MISINFORMATION']
  // class 0: INFORMATION, class 1: MISINFORMATION
  const p1 = 1 / (1 + Math.exp(-z));
  const p0 = 1 - p1;

  const predictedClass = p1 >= 0.5 ? 'MISINFORMATION' : 'INFORMATION';
  const confidence = Math.max(p0, p1) * 100;

  return {
    predictedClass,
    confidence: Number(confidence.toFixed(2)),
    p0: Number((p0 * 100).toFixed(2)),
    p1: Number((p1 * 100).toFixed(2))
  };
}

console.log('\n--- TESTING PREDICTIONS ON SAMPLES ---');
const testSamples = [
  'రైతులకు ప్రభుత్వం కొత్త పథకాన్ని ప్రకటించింది',
  'ఈ ఎరువును వాడితే ఒక్క రోజులో పంట దిగుబడి రెట్టింపు అవుతుంది',
  'వ్యవసాయ శాఖ రైతులకు శిక్షణ కార్యక్రమం నిర్వహించింది'
];

testSamples.forEach((sample, i) => {
  const res = predictNews(sample);
  console.log(`\nSample ${i + 1}: "${sample}"`);
  console.log(`Predicted Class: ${res.predictedClass}`);
  console.log(`Confidence: ${res.confidence}% (P(Misinformation): ${res.p1}%, P(Information): ${res.p0}%)`);
});
