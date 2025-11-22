const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middleware/validation');

router.post('/:id/comments', validateComment, commentController.addComment);
router.get('/:id/comments', commentController.getComments);

module.exports = router;