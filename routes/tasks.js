const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const isAuth = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

// 所有 task route 都要經過 isAuth
router.use(isAuth);

router.get('/dashboard', async (req, res) => {
  const tasks = await Task.find({ user: req.session.user._id }).sort({ createdAt: -1 });
  res.render('dashboard', { tasks, user: req.session.user });
});

router.post('/tasks', async (req, res) => {
  const task = new Task({ ...req.body, user: req.session.user._id });
  await task.save();
  res.redirect('/dashboard');
});

router.put('/tasks/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/dashboard');
});

router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;