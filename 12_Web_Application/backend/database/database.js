const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname);
const SQLITE_FILE = path.join(DB_DIR, 'predictions.sqlite');
const BACKUP_JSON = path.join(DB_DIR, 'predictions_history.json');

let db = null;
let sqlEngine = null;

// Initialize SQLite WebAssembly engine
async function initDatabase() {
  try {
    const initSqlJs = require('sql.js');
    sqlEngine = await initSqlJs();

    if (fs.existsSync(SQLITE_FILE)) {
      const fileBuffer = fs.readFileSync(SQLITE_FILE);
      db = new sqlEngine.Database(fileBuffer);
    } else {
      db = new sqlEngine.Database();
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        news_text TEXT NOT NULL,
        predicted_label TEXT NOT NULL,
        confidence REAL NOT NULL,
        p_information REAL DEFAULT 0.0,
        p_misinformation REAL DEFAULT 0.0,
        model_name TEXT DEFAULT 'Logistic Regression'
      )
    `);
    persistSqlite();
    console.log('[Database] SQLite WebAssembly database successfully initialized at:', SQLITE_FILE);
  } catch (err) {
    console.warn('[Database Warning] sql.js init error, falling back to JSON persistence:', err.message);
  }
}

function persistSqlite() {
  if (db) {
    try {
      const data = db.export();
      fs.writeFileSync(SQLITE_FILE, Buffer.from(data));
    } catch (e) {
      console.error('[Database] Failed to persist SQLite binary:', e);
    }
  }
}

function readJsonStore() {
  try {
    if (!fs.existsSync(BACKUP_JSON)) return [];
    return JSON.parse(fs.readFileSync(BACKUP_JSON, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function writeJsonStore(data) {
  try {
    fs.writeFileSync(BACKUP_JSON, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[Database] Failed writing JSON store:', e);
  }
}

// Start async initialization immediately
initDatabase();

function addPrediction(record) {
  const timestamp = record.timestamp || new Date().toISOString();
  const newsText = record.news_text || record.text || '';
  const predictedLabel = record.predicted_label || 'INFORMATION';
  const confidence = Number(record.confidence || 0);
  const pInfo = Number(record.p_information || 0);
  const pMisinfo = Number(record.p_misinformation || 0);
  const modelName = record.model_name || 'Logistic Regression (Scikit-Learn)';

  if (db) {
    db.run(
      `INSERT INTO predictions (timestamp, news_text, predicted_label, confidence, p_information, p_misinformation, model_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [timestamp, newsText, predictedLabel, confidence, pInfo, pMisinfo, modelName]
    );
    persistSqlite();

    const res = db.exec('SELECT last_insert_rowid() as id');
    const newId = res[0] && res[0].values[0] ? res[0].values[0][0] : 1;

    return {
      id: newId,
      timestamp,
      news_text: newsText,
      predicted_label: predictedLabel,
      confidence,
      p_information: pInfo,
      p_misinformation: pMisinfo,
      model_name: modelName
    };
  } else {
    const items = readJsonStore();
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id || 0)) + 1 : 1;
    const item = {
      id: newId,
      timestamp,
      news_text: newsText,
      predicted_label: predictedLabel,
      confidence,
      p_information: pInfo,
      p_misinformation: pMisinfo,
      model_name: modelName
    };
    items.unshift(item);
    writeJsonStore(items);
    return item;
  }
}

function getHistory({ search = '', filterClass = '', limit = 100, offset = 0 } = {}) {
  const cleanSearch = String(search || '').trim().toLowerCase();
  const cleanClass = String(filterClass || '').trim().toUpperCase();

  if (db) {
    let query = 'SELECT id, timestamp, news_text, predicted_label, confidence, p_information, p_misinformation, model_name FROM predictions WHERE 1=1';
    const params = [];

    if (cleanSearch) {
      query += ' AND LOWER(news_text) LIKE ?';
      params.push(`%${cleanSearch}%`);
    }

    if (cleanClass && (cleanClass === 'INFORMATION' || cleanClass === 'MISINFORMATION')) {
      query += ' AND predicted_label = ?';
      params.push(cleanClass);
    }

    // Count
    const countSql = query.replace('SELECT id, timestamp, news_text, predicted_label, confidence, p_information, p_misinformation, model_name', 'SELECT COUNT(*) as total');
    const countRes = db.exec(countSql, params);
    const total = countRes[0] && countRes[0].values[0] ? countRes[0].values[0][0] : 0;

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit) || 100, Number(offset) || 0);

    const execRes = db.exec(query, params);
    const records = [];
    if (execRes[0] && execRes[0].values) {
      const cols = execRes[0].columns;
      for (const row of execRes[0].values) {
        const obj = {};
        cols.forEach((col, idx) => (obj[col] = row[idx]));
        records.push(obj);
      }
    }

    return { total, records };
  } else {
    let items = readJsonStore();
    if (cleanSearch) {
      items = items.filter((it) => (it.news_text || '').toLowerCase().includes(cleanSearch));
    }
    if (cleanClass && (cleanClass === 'INFORMATION' || cleanClass === 'MISINFORMATION')) {
      items = items.filter((it) => it.predicted_label === cleanClass);
    }
    const total = items.length;
    const records = items.slice(offset, offset + limit);
    return { total, records };
  }
}

function clearHistory() {
  if (db) {
    db.run('DELETE FROM predictions');
    persistSqlite();
  }
  writeJsonStore([]);
  return { cleared: true };
}

function exportCSV() {
  const { records } = getHistory({ limit: 10000, offset: 0 });
  const headers = ['ID', 'Timestamp', 'Telugu News Text', 'Predicted Label', 'Confidence (%)', 'Information Prob (%)', 'Misinformation Prob (%)', 'Model Used'];
  const lines = [headers.join(',')];

  for (const row of records) {
    const escaped = `"${String(row.news_text || '').replace(/"/g, '""')}"`;
    lines.push([
      row.id,
      `"${row.timestamp}"`,
      escaped,
      row.predicted_label,
      row.confidence,
      row.p_information,
      row.p_misinformation,
      `"${row.model_name}"`
    ].join(','));
  }

  return lines.join('\n');
}

module.exports = {
  addPrediction,
  getHistory,
  clearHistory,
  exportCSV
};
