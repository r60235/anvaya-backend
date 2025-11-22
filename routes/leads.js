const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateLead } = require('../middleware/validation');

router.post('/', validateLead, leadController.createLead);
router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', validateLead, leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router; 