const fs = require('fs');
const path = require('path');

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
    if (op === 0x80) { pos++; }
    else if (op === 0x95) { pos += 8; }
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

const tfidfObj = unpickle(fs.readFileSync(path.join(baseDir, '06_TFIDF_Feature_Extraction/TFIDF_Vectorizer.pkl')));
const lrObj = unpickle(fs.readFileSync(path.join(baseDir, '07_Machine_Learning/Logistic_Regression_Model.pkl')));
const svmObj = unpickle(fs.readFileSync(path.join(baseDir, '07_Machine_Learning/Linear_SVM_Model.pkl')));

const transformer = tfidfObj.__state__._tfidf;
const idfArray = extractNumpyArray(transformer.__state__.idf_);

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

const lrClasses = lrObj.__state__.classes_.__state__[4];
const lrIntercept = extractNumpyArray(lrObj.__state__.intercept_)[0];
const lrCoef = extractNumpyArray(lrObj.__state__.coef_);

const svmIntercept = extractNumpyArray(svmObj.__state__.intercept_)[0];
const svmCoef = extractNumpyArray(svmObj.__state__.coef_);

const extracted = {
  modelName: "Logistic Regression (Final Selected Model)",
  classes: lrClasses,
  vocabulary,
  vocabularySize: Object.keys(vocabulary).length,
  idf: idfArray,
  logisticRegression: {
    intercept: lrIntercept,
    coef: lrCoef
  },
  linearSVM: {
    intercept: svmIntercept,
    coef: svmCoef
  }
};

const outPath = 'C:/Users/poorn/.gemini/antigravity/scratch/telugu_misinformation_project/12_Web_Application/backend/services/model_extracted_parameters.json';
fs.writeFileSync(outPath, JSON.stringify(extracted, null, 2), 'utf8');
console.log('Saved model parameters to:', outPath);
console.log('Vocab size:', extracted.vocabularySize, 'IDF count:', extracted.idf.length, 'Coef count:', extracted.logisticRegression.coef.length);
