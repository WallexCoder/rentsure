const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createReport, searchReports, getRecentReports, getAgentReports } = require('../controllers/reportController');

router.post('/', authMiddleware, createReport);
router.get('/search', searchReports);
router.get('/recent', getRecentReports);
router.get('/agent/:phone', getAgentReports);

module.exports = router;