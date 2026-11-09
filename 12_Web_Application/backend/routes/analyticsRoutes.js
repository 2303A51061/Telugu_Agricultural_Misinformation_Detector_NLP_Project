const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboard);
router.get('/samples', analyticsController.getSamples);
router.get('/analytics', analyticsController.getAnalytics);
router.get('/model-performance', analyticsController.getModelPerformance);

module.exports = router;
