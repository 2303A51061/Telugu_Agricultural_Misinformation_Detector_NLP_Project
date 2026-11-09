const database = require('../database/database');

function getHistory(req, res, next) {
  try {
    const { search, filter, limit, offset } = req.query;
    const history = database.getHistory({
      search: search || '',
      filterClass: filter || '',
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0
    });
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
}

function clearHistory(req, res, next) {
  try {
    database.clearHistory();
    return res.status(200).json({ success: true, message: 'Prediction history cleared successfully.' });
  } catch (error) {
    next(error);
  }
}

function exportHistory(req, res, next) {
  try {
    const csvContent = database.exportCSV();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="telugu_prediction_history.csv"');
    return res.status(200).send('\uFEFF' + csvContent); // UTF-8 BOM for Excel Telugu support
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHistory,
  clearHistory,
  exportHistory
};
