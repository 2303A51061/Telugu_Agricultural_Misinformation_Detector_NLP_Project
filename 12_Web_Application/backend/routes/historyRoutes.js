const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/history', historyController.getHistory);
router.delete('/history', historyController.clearHistory);
router.get('/history/export', historyController.exportHistory);

module.exports = router;
