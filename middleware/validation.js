const { body, param } = require('express-validator');

// Lead validation
exports.validateLead = [
  body('name')
    .notEmpty()
    .withMessage('Lead name is required')
    .isString()
    .withMessage('Lead name must be a string'),
  body('source')
    .isIn(['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'])
    .withMessage('Invalid lead source'),
  body('salesAgent')
    .isMongoId()
    .withMessage('Invalid sales agent ID'),
  body('status')
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'])
    .withMessage('Invalid lead status'),
  body('timeToClose')
    .isInt({ min: 1 })
    .withMessage('Time to close must be a positive integer'),
  body('priority')
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Invalid priority level')
];

// Sales agent validation
exports.validateAgent = [
  body('name')
    .notEmpty()
    .withMessage('Agent name is required')
    .isString()
    .withMessage('Agent name must be a string'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

// Comment validation
exports.validateComment = [
  body('commentText')
    .notEmpty()
    .withMessage('Comment text is required')
    .isString()
    .withMessage('Comment text must be a string'),
  body('author')
    .isMongoId()
    .withMessage('Invalid author ID')
];