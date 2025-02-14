const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllPosts);
router.get('/new', blogController.getNewPostForm);
router.post('/new', blogController.createNewPost);
router.get('/post/:id', blogController.getPostById);

module.exports = router;
