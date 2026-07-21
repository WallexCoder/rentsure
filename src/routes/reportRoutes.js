const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createReport, searchReports, getRecentReports } = require('../controllers/reportController');

router.post('/', authMiddleware, createReport);   // must be logged in to report
router.get('/search', searchReports);              // open to everyone
router.get('/recent', getRecentReports);            // open to everyone

module.exports = router;