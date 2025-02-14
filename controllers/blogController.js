const Blog = require('../models/blogModel');

exports.getAllPosts = async (req, res) => {
  const posts = await Blog.find();
  res.render('index', { posts });
};

exports.getNewPostForm = (req, res) => {
  res.render('new');
};

exports.createNewPost = async (req, res) => {
  const { title, content } = req.body;
  await Blog.create({ title, content });
  res.redirect('/');
};

exports.getPostById = async (req, res) => {
  const post = await Blog.findById(req.params.id);
  res.render('post', { post });
};
