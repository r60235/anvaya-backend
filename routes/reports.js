const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/last-week', reportController.getLeadsClosedLastWeek);
router.get('/pipeline', reportController.getPipelineTotal);
router.get('/closed-by-agent', reportController.getLeadsClosedByAgent);
router.get('/status-distribution', reportController.getLeadStatusDistribution);

module.exports = router; 