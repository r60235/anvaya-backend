const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { validateAgent } = require('../middleware/validation');

router.post('/', validateAgent, agentController.createAgent);
router.get('/', agentController.getAgents);

module.exports = router;