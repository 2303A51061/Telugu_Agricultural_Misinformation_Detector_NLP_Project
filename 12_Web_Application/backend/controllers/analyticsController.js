const datasetService = require('../services/datasetService');

function getDashboard(req, res, next) {
  try {
    const stats = datasetService.getDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

function getSamples(req, res, next) {
  try {
    const samples = datasetService.getSamples();
    return res.status(200).json({ success: true, data: samples });
  } catch (error) {
    next(error);
  }
}

function getAnalytics(req, res, next) {
  try {
    const analytics = datasetService.getAnalytics();
    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}

function getModelPerformance(req, res, next) {
  try {
    const performance = datasetService.getModelPerformance();
    return res.status(200).json({ success: true, data: performance });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getSamples,
  getAnalytics,
  getModelPerformance
};
