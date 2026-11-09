const mlService = require('../services/mlService');
const database = require('../database/database');

async function handlePredict(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Telugu text is required. Please provide Telugu agricultural text to analyze.'
      });
    }

    const prediction = await mlService.predictText(text);

    // Save to SQLite prediction history
    const savedRecord = database.addPrediction({
      news_text: prediction.original_text,
      predicted_label: prediction.predicted_label,
      confidence: prediction.confidence,
      p_information: prediction.p_information,
      p_misinformation: prediction.p_misinformation,
      model_name: prediction.model_name
    });

    return res.status(200).json({
      success: true,
      data: {
        id: savedRecord.id,
        timestamp: savedRecord.timestamp,
        ...prediction
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handlePredict
};
